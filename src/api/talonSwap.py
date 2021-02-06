from __main__ import sio
from flask import request
import json



def chooseKing(self, king):
    playerIndex = self.getPlayerIndex(request.sid)

    if playerIndex != self.turn or self.stage != "chooseKing": 
        self.error("Illegal move - It's not your turn")
        return None

    if king not in ["srce_kralj", "kara_kralj", "pik_kralj", "kriz_kralj"]:
        self.error("Illegal move - Stop Hacking")
        return None

    self.gameType["king"] = king



    kingHolder = playerIndex
    for (i, player) in enumerate(self.players):
        if king in player["hand"]:
            kingHolder = i
            break

    self.gameType["with"] = kingHolder

    self.stage = "chooseTalon"
    self.showTalon()





def showTalon(self):

    if self.stage not in ["chooseTalon", "talonSwap"]:
        self.error("Illegal move - Stop Hacking")
        return None

    if self.gameType["name"] in ["ena", "solo_ena"]:
        self.talon = [[t] for t in self.talon]
    elif self.gameType["name"] in ["dva", "solo_dva"]:
        self.talon = [self.talon[i:i+2] for i in [0, 2, 4]]
    elif self.gameType["name"] in ["tri", "solo_tri"]:
        self.talon = [self.talon[i:i+3] for i in [0, 3]]
    else:
        print("illegal move")
        return None

    self.dispatchPublicState("getState")





def chooseTalon(self, index):
    playerIndex = self.getPlayerIndex(request.sid)

    if self.stage != "chooseTalon" or playerIndex != self.turn:
        self.error("Illegal move - It's not your turn")
        return None

    # set talon to chosen subset 
    self.talon = [self.talon[index]]
    self.stage = "talonSwap"
    self.dispatchPublicState("getState")





def talonSwap(self, card):
    playerIndex = self.getPlayerIndex(request.sid)

    if self.stage != "talonSwap" or self.turn != playerIndex:
        self.error("Illegal move - It's not your turn")
        return None

    if card not in self.players[playerIndex]["hand"]:
        self.error("Illegal move - Stop Hacking")
        return None


    # transfer first card in talon to player's hand
    cardIndex = self.players[playerIndex]["hand"].index(card)
    self.players[playerIndex]["hand"][cardIndex] = self.talon[0][0]
    self.talon[0].pop(0)

    if self.talon[0] == []:
        self.stage = "active"
        self.turn = 0
    self.dispatchPublicState("getState")












