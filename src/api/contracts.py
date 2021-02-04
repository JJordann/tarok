from __main__ import sio
from flask import request
from util2 import *
import json


class Contracts:

    def __init__(self, players, room):
        self.turn = 0 
        (talon, hands) = dealCards(deck, len(players))
        self.talon = talon
        self.players = [{
            "name": p["name"],
            "sid": p["sid"],
            "hand": hands[i]
        } for (i, p) in enumerate(players)]
        self.playableTypes = list(allContracts.keys())
        self.gameType = {} # playerName, type
        self.dispatchPublicState("getState")
        print("CONTRACTS READY")


    def dispatchPublicState(self, event):
        for player in self.players:
            playerState = self.getPublicState(player["sid"])
            sio.emit(event, json.dumps(playerState), room=player["sid"])


    def getPublicState(self, sid):
        playerIndex = next(i for i,v in enumerate(self.players) if v["sid"] == sid)
        player = self.players[playerIndex]
        
        publicState =  {
            "stage": "contracts",
            "turn": self.turn,
            "myIndex": playerIndex,
            "players": [{
                "name": p["name"],
                "scores": p["scores"] if "scores" in p.keys() else []
            } for p in self.players],
            "hand": player["hand"],
            "gameType": self.gameType,
            "playableTypes": self.playableTypes
        }

        return publicState



    def getCards(self):
        playerState = self.getPublicState(request.sid)
        sio.emit("getState", json.dumps(playerState), room=request.sid)