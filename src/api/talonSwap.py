from __main__ import sio
from flask import request
import json



def chooseKing(self, king):
    playerIndex = self.getPlayerIndex(request.sid)

    if playerIndex != self.turn or self.stage != "chooseKing": 
        print("illegal move")
        return None

    self.gameType["king"] = king
    self.stage = "chooseTalon"
    self.showTalon()





def showTalon(self):

    if self.stage not in ["chooseTalon", "talonSwap"]:
        print("illegal move")
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








def pickTalon(self, index):
    return None





def talonSwap(self, card):
    return None