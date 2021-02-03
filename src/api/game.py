from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room

import json
from deck import *
from util2 import *


class Game:

    def __init__(self, room):
        self.room = room
        self.players = []
        self.state = "lobby"

    def leave(self):
        self.players = [u for u in self.players if u["sid"] != request.sid]
        self.dispatchGameLobbyState()
    
    def dispatchGameLobbyState(self):
        msg = [[u["name"], u["ready"], False] for u in self.players]
        for i in range(0, len(self.players)):
            msg[i][2] = True
            sio.emit("getUsers", msg, room=self.players[i]["sid"])
            msg[i][2] = False

    def initGame(self, players):
        # Hand over players from lobby to game state 
        self.players = players

        (talon, hands) = dealCards(deck, len(self.players))
        self.talon = talon
        self.table = []
        self.state = "contracts"
        self.players = [
                {
                    "name": p["name"],
                    "sid": p["sid"],
                    "hand": hands[i][0:2],
                    "ready": True,
                    "cardsWon": [],
                    "turn": (i == 0),
                    "contractBonus": [],
                    "contracts": []
                } for (i, p) in enumerate(self.players)
        ]


    def getCards(self):
        playerState = self.getPublicState(request.sid)
        sio.emit("getState", json.dumps(playerState), room=request.sid)



    def getPublicState(self, sid):
        playerIndex = next(i for i,v in enumerate(self.players) if v["sid"] == sid)
        player = self.players[playerIndex]
        
        _playable = []
        if player["turn"] == True and self.state == "active":
            _playable = playable(player["hand"], self.table)
        
        publicState =  {
            "phase": self.state,
            "myIndex": playerIndex,
            "table": self.table,
            "players": [{
                "name": p["name"],
                "contracts": p["contracts"]
            } for p in self.players],
            "hand": player["hand"],
            "playable": _playable,
            "cardsWon": player["cardsWon"],
            "turn": player["turn"]
        }

        if self.state == "contracts":
            publicState["playableContracts"] = playableContracts(self.players) + ["naprej"]

        return publicState



    def dispatchPublicState(self, event):
        for player in self.players:
            playerState = self.getPublicState(player["sid"])
            sio.emit(event, json.dumps(playerState), room=player["sid"])







    def concludeGame(self):
        print("---- GAME OVER ----")

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
        sender = next(p for p in self.players if p["sid"] == player)

        if sender["turn"] != True:
            print("It's not your turn. Stop hacking.")
            return None

        if card not in playable(sender["hand"], self.table):
            print("Illegal move. Stop hacking.")
            return None

        nPlayers = len(self.players)
        playerIndex = next(i for i,p in enumerate(self.players) if p["turn"] == True)

        # transfer played card from hand to table
        self.table.append(card)
        self.players[playerIndex]["hand"].remove(card)

        # transfer turn to next player
        self.players[playerIndex]["turn"] = False
        self.players[(playerIndex + 1) % nPlayers]["turn"] = True

        if len(self.table) < nPlayers:
            # round is not over
            return None
        
        # round is over, transfer table to round winner
        takesIndex = takes(self.table)
        takesPlayer = ((playerIndex - (nPlayers - 1)) % nPlayers + takesIndex) % nPlayers
        self.players[takesPlayer]["cardsWon"] += self.table

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
        self.players[(playerIndex + 1) % nPlayers]["turn"] = False
        self.players[takesPlayer]["turn"] = True
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
            self.state = "active"


    def playContract(self, contract):
        sender = next(p for p in self.players if p["sid"] == request.sid)

        if sender["turn"] == False:
            print("It's not your turn. Stop hacking.")
            return None


        playerIndex = self.players.index(sender)
        self.players[playerIndex]["contracts"] += [contract]

        # transfer turn to next player
        self.players[playerIndex]["turn"] = False
        self.players[(playerIndex + 1) % len(self.players)]["turn"] = True

        for player in self.players:
            print(player["name"], ": ", player["contracts"])

        if contract != "naprej":
            msg = sender["name"] + " played " + contract
            sio.emit("INFO", msg, room="joined")

        self.finishContracts()
        self.dispatchPublicState("getState")

