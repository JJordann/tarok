from __main__ import sio
from flask import request

import json


def valueOfGameType(gameType):
    if gameType["name"] in ["naprej", "choosing"]:
        return 0
    global gameTypes
    return next(g for g in gameTypes if g["name"] == gameType["name"])["value"]



def playGameType(self, gameType):
    playerIndex = self.getPlayerIndex(request.sid)
    isPlayerLast = playerIndex == self.lastPlayer()

    if self.turn != playerIndex or gameType not in playableGames(self.gameType, isPlayerLast, len(self.players)):
        self.error("Illegal move - It's not your turn")
        return None

    self.gameType[playerIndex] = {
        "name": gameType,
        "player": playerIndex
    }

    if len([g for g in self.gameType if g["name"] != "choosing"]) == len(self.players):
        # every player has played a game type or skipped
        if len([g for g in self.gameType if g["name"] == "naprej"]) >= len(self.players) - 1:
            # every player but one skipped, game type is determined
            # set self.gameType to a single dict
            finishGameType(self)
            self.dispatchPublicState("getState")
            return None

    self.passTurn()
    while self.gameType[self.turn]["name"] == "naprej":
        # if player has previously skipped, auto skip
        self.passTurn()

    self.dispatchPublicState("getState")



def finishGameType(self):
    if all([g["name"] == "naprej" for g in self.gameType]):
        # every player skipped
        self.gameType = {
            "name": "normal",
            "player": -1
        }
    else: 
        # set game type of highest value
        self.gameType = max(self.gameType, key=valueOfGameType)

    if self.gameType["name"] in ["ena", "dva", "tri"]:
        # choose king
        self.stage = "chooseKing"
        self.turn = self.gameType["player"]

    elif self.gameType["name"] in ["solo_ena", "solo_dva", "solo_tri"]:
        # swap with talon
        self.stage = "chooseTalon"
        self.turn = self.gameType["player"]
        self.showTalon()
    else:
        # no talon swap, straight to game
        self.stage = "active"
        self.turn = self.startingPlayer()






gameTypes = [
        {
            "name": "tri",
            "value": 10
        },
        {
            "name": "solo_tri",
            "value": 20
        },
        {
            "name": "dva",
            "value": 20
        },
        {
            "name": "ena",
            "value": 30
        },
        {
            "name": "solo_dva",
            "value": 30
        },
        {
            "name": "solo_ena",
            "value": 40
        },
        {
            "name": "solo_brez",
            "value": 50
        },
        {
            "name": "pikolo",
            "value": 60
        },
        {
            "name": "berac",
            "value": 70
        },
        {
            "name": "odprti_berac",
            "value": 80
        }
]




def playableGames(gameType, isPlayerLast, numPlayers):
    global gameTypes
    if numPlayers == 4:
        _gameTypes = gameTypes
    else:
        _gameTypes = [g for g in gameTypes if g["name"] not in ["tri", "dva", "ena"]]

    if all([g["name"] in ["choosing", "naprej"] for g in gameType]):
        # no game was played yet
        if isPlayerLast:
            # player is last and no game was played, every game is playable
            return [g["name"] for g in _gameTypes] + ["naprej"]
        else:
            return [g["name"] for g in _gameTypes if g["name"] != "tri"] + ["naprej"]
            # player is last and game was played, return all games with equal or higher value

    # a game was played already
    currentGameValue = valueOfGameType(max(gameType, key=valueOfGameType))
    
    if isPlayerLast: 
        return [g["name"] for g in _gameTypes if g["value"] >= currentGameValue] + ["naprej"]
    else:
        return [g["name"] for g in _gameTypes if g["value"] > currentGameValue and g["name"] != "tri"] + ["naprej"]
