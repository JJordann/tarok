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
        self.talon = talon
        self.table = []
        self.stage = "active"
        self.players = [
                {
                    "name": p["name"],
                    "sid": p["sid"],
                    "hand": hands[i],
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
        if player["turn"] == True and self.stage == "active":
            _playable = playable(player["hand"], self.table)
        
        publicState =  {
            "phase": self.stage,
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

        #if self.stage == "contracts":
            #publicState["playableContracts"] = playableContracts(gameState) + ["naprej"]

        return publicState