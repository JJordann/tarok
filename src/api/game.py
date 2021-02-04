from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room

import json
from deck import *
from util2 import *
from contracts import *


class Game:

    def __init__(self, room):
        Game.playGameType = playGameType
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
        self.gameType = [
            {
                "name": "choosing",
                "player": i
            } for (i, p) in enumerate(self.players)
        ]
        self.table = []
        self.stage = "gameType"
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
            "gameType": self.gameType,
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

        if self.stage == "gameType":
            isPlayerLast = self.turn == len(self.players) - 1
            publicState["playableGames"] = playableGames(self.gameType, isPlayerLast)


        #if self.stage == "contracts":
            #publicState["playableContracts"] = playableContracts(self) + ["naprej"]

        return publicState



    def dispatchPublicState(self, event):
        for player in self.players:
            playerState = self.getPublicState(player["sid"])
            sio.emit(event, json.dumps(playerState), room=player["sid"])




    def getPlayerIndex(self, sid):
        for i, p in enumerate(self.players):
            if p["sid"] == sid:
                return i
        return -1



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









    def showTalon(self, contract):
        return None