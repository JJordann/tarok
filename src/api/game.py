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
        self.stage = "lobby"

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
        self.turn = 0
        self.talon = talon
        self.table = []
        self.stage = "gameType"
        self.gameType = {}
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
                "scores": p["scores"] if "scores" in p.keys() else []
            } for p in self.players],
            "hand": player["hand"],
            "playable": _playable,
            "cardsWon": player["cardsWon"]
        }


        #if self.stage == "gameType":
            #publicState["playableGameTypes"] = playableGameTypes(self.players) + ["naprej"]

        #if self.stage == "contracts":
            #publicState["playableContracts"] = playableContracts(self.players) + ["naprej"]

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





    def playableGameTypes(self, playerIndex):
        


        return None

















    # returns index of player who is currently choosing contract,
    # or -1 if all have chosen
    if False: """
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
    """



    def showTalon(self, contract):

 
        # TODO: contract preberi iz stanja

        if self.stage != "talon_swap" or contract not in ["ena", "dva", "tri", "solo_ena", "solo_dva", "solo_tri"]:
            print("illegal talon request")
            return None

        # group talon cards
        if "dva" in contract:
            self.talon = [self.talon[i:i+2] for i in [0, 2, 4]]
        elif "tri" in contract: 
            self.talon = [self.talon[i:i+3] for i in [0, 3]]
        else:
            self.talon = [[t] for t in self_talon]

        print(self.talon)
        


    def pickTalonIndex(self, index):

        if self.stage != "talon_swap" or contract not in ["ena", "dva", "tri", "solo_ena", "solo_dva", "solo_tri"]:
            return None


        if index >= len(self.talon):
            print("illegal talon index")        
            return None

        self.talonSwapped = 0
        self.talonIndex = index
        # TODO: dodaj talonIndex v public state
        self.dispatchPublicState("getState")


    def swapTalon(self, card):
        if self.stage != "talon_swap" or self.talonSwapped >= len(self.talon[0]):
            return None

        player = self.players[findPlayerBySid(request.sid)]

        if card not in player["hand"]:
            print("illegal swap")
            return None

        # swap card with first unswapped talon card
        cardIndex = player["hand"].index(card)
        player["hand"][cardIndex] = self.talon[self.talonIndex][self.talonSwapped]
        self.talon[self.talonIndex][self.talonSwapped] = card

        self.talonSwapped += 1
        if self.talonSwapped == len(self.talon[0]):
            # last card was swapped
            self.stage = "active"

        self.dispatchPublicState("getState")



        
            





























