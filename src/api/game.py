from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room

import json
from deck import *
from util2 import *


class Game:

    def __init__(self):
        self.room = "joined"
        self.players = []
        self.stage = "lobby"


    def join(self, name):
        self.players.append({"name": name, 
                               "sid": request.sid,
                               "ready": False})
        self.dispatchLobbyState()
        join_room(self.room)



    def ready(self, msg):
        for u in self.players:
            if u["sid"] == request.sid:
                u["ready"] = True if (msg == "true") else False
                if self.allReady() == True:
                    self.handleAllReady()
        self.dispatchLobbyState()
    


    def allReady(self):
        return all(map(lambda x: x["ready"], self.players))



    def handleAllReady(self):
        print("****** ALL READY ****** ")
        sio.emit("allReady", room="joined")
        self.initGame(deck)



    def disconnect(self):
        self.players = [u for u in self.players if u["sid"] != request.sid]
        self.dispatchLobbyState()
        leave_room(self.room)



    def dispatchLobbyState(self):
        msg = [[u["name"], u["ready"], False] for u in self.players]
        for i in range(0, len(self.players)):
            msg[i][2] = True
            sio.emit("getUsers", msg, room=self.players[i]["sid"])
            msg[i][2] = False



    def initGame(self, deck): 
        (talon, hands) = dealCards(deck, len(self.players))
        self.turn = 0
        self.talon = talon
        self.table = []
        self.stage = "contracts"
        self.players = [
                {
                    "name": p["name"],
                    "sid": p["sid"],
                    "hand": hands[i][0:2],
                    "ready": True,
                    "cardsWon": [],
                    "contractBonus": [],
                    "contracts": [],
                    "scores": p["scores"] if "scores" in p.keys() else []
                } for (i, p) in enumerate(self.players)
        ]


    def getCards(self):
        playerState = self.getPublicState(request.sid)
        sio.emit("getState", json.dumps(playerState), room=request.sid)



    def getPublicState(self, sid):
        playerIndex = next(i for i,v in enumerate(self.players) if v["sid"] == sid)
        player = self.players[playerIndex]
        
        _playable = []
        if self.turn == playerIndex and self.stage == "active":
            _playable = playable(player["hand"], self.table)
        
        publicState =  {
            "stage": self.stage,
            "turn": self.turn,
            "myIndex": playerIndex,
            "table": self.table,
            "players": [{
                "name": p["name"],
                "contracts": p["contracts"],
                "scores": p["scores"]
            } for p in self.players],
            "hand": player["hand"],
            "playable": _playable,
            "cardsWon": player["cardsWon"]
        }

        if self.stage == "contracts":
            publicState["playableContracts"] = playableContracts(self.players) + ["naprej"]

        return publicState



    def dispatchPublicState(self, event):
        for player in self.players:
            playerState = self.getPublicState(player["sid"])
            sio.emit(event, json.dumps(playerState), room=player["sid"])




    def getPlayerIndex(self, sid):
        return next(i for i,p in enumerate(self.players) if p["sid"] == sid)



    def passTurn(self):
        self.turn = (self.turn + 1) % len(self.players)



    def concludeGame(self):
        print("---- ROUND OVER ----")
        self.stage = "round_finished"

        #for player in self.players:
            #player["contractBonus"] += contractBonus(player["cardsWon"])
            #for contract in player["contractBonus"]:
                #player["score"] += contract["value"]

        ranked = sorted(self.players, key=lambda p: score(p["cardsWon"]), reverse=True)
        self.results = [
            {
                "name": player["name"],
                "place": index,
                "score": score(player["cardsWon"]),
                "cardsWon": player["cardsWon"],
                "contractBonus": player["contractBonus"]
            } for index, player in enumerate(ranked)
        ]
        sio.emit("gameOver", self.results, broadcast=True, room=self.room)



    def handlePlayCard(self, card):
        self.playCard(card, request.sid)
        self.dispatchPublicState("getState")

        if all(len(p["hand"]) == 0 for p in self.players):
            results = self.concludeGame()
            sio.emit("gameOver", results, room=self.room)



    def playCard(self, card, player):
        playerIndex = self.getPlayerIndex(player)

        if self.turn != playerIndex != True:
            print("It's not your turn. Stop hacking.")
            return None

        if card not in playable(self.players[playerIndex]["hand"], self.table):
            print("Illegal move. Stop hacking.")
            return None

        nPlayers = len(self.players)

        # transfer played card from hand to table
        self.table.append(card)
        self.players[playerIndex]["hand"].remove(card)

        # transfer turn to next player
        self.passTurn()

        if len(self.table) < nPlayers:
            # round is not over
            return None
        
        # round is over, transfer table to round winner
        takesIndex = takes(self.table)
        takesPlayer = ((playerIndex - (nPlayers - 1)) % nPlayers + takesIndex) % nPlayers
        self.players[takesPlayer]["cardsWon"] += self.table

        # log round
        msg = str(self.players[takesPlayer]["name"]) + " takes -- " + self.table[takesIndex] + " takes " + str(self.table)
        sio.emit("INFO", msg, room=self.room)
        print(msg)

        if all(len(p["hand"]) == 0 for p in self.players):
            # players have no cards, game ends
            # check for pagat ultimo
            pagatIndex = pagatUltimo(self.table)
            if pagatIndex > -1:
                pagatPlayer = (pagatIndex + pagatIndex) % nPlayers
                self.players[pagatPlayer]["contractBonus"] += [{"bonus": "pagatUltimo", "value": 25}]
                msg = "PAGAT ULTIMO: " + self.players[pagatPlayer]["name"]
                print(msg)
                sio.emit("INFO", msg, room=self.room)

        # player who takes begins next round
        self.turn = takesIndex
        self.table = []



    def sendChat(self, msg):
        sender = next(p for p in self.players if p["sid"] == request.sid)["name"]
        print(sender,"> ", msg)
        sio.emit("chat", json.dumps({"sender": sender, "message": msg}), room=self.room)




    # returns index of player who is currently choosing contract,
    # or -1 if all have chosen
    def finishContracts(self):
        contracts = [p["contracts"] for p in self.players]
        done = all([len(c) > 0 and c[-1] == "naprej" for c in contracts])
        # every player recently skipped
        if done:
            self.stage = "active"


    def playContract(self, contract):
        playerIndex = self.getPlayerIndex(request.sid)

        if self.turn != playerIndex:
            print("It's not your turn. Stop hacking.")
            return None

        self.players[playerIndex]["contracts"] += [contract]

        self.passTurn()

        for player in self.players:
            print(player["name"], ": ", player["contracts"])

        if contract != "naprej":
            msg = self.players[playerIndex]["name"] + " played " + contract
            sio.emit("INFO", msg, room="joined")

        self.finishContracts()
        self.dispatchPublicState("getState")
