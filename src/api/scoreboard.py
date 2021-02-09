from __main__ import sio
from util import score
import json


# handles solo_*, ena, dva, tri
def teamScores(self): 
    _scores = [score(p["cardsWon"]) for p in self.players]
    self.info("Card value: " + str(_scores))

    # player and his (potential) teammate
    playerTeam = [self.gameType["player"]]
    if "with" in self.gameType and self.gameType["with"] != -1:
        playerTeam.append(self.gameType["with"])

    # opposing team: everyone else
    opposingTeam = [i for i in range(len(self.players)) if i not in playerTeam]

    # sum points of each team
    playerSum   = sum(_scores[i] for i in playerTeam)
    opposingSum = sum(_scores[i] for i in opposingTeam)
    talonSum = score([c for pack in self.talon for c in pack])
    self.info("Talon value: " + str(talonSum))

    # if called king was in talon...
    if "with" in self.gameType and self.gameType["with"] == -1:
        if self.gameType["king"] in self.players[self.gameType["player"]]["cardsWon"]:
            # if called king ended up in caller's cardsWon...
            # add remaining talon score to the player
            playerSum += talonSum
        else:
            # otherwise add it to opposing team
            opposingSum += talonSum
    elif "solo" in self.gameType["name"]:
        opposingSum += talonSum


    # if player is playing solo, add talon to opposing team


    # each player's score is equal to his team's
    for i in playerTeam:
        _scores[i] = playerSum

    for i in opposingTeam:
        _scores[i] = opposingSum

    return _scores



def normalScores(self):
    _scores = [score(p["cardsWon"]) for p in self.players]
    self.info("Card value: " + str(_scores))
    return _scores



def concludeGame(self):
    self.info("Game over")
    self.stage = "roundFinished"

    if self.gameType["name"] in ["ena", "dva", "tri", "solo_ena", "solo_dva", "solo_tri"]:
        _scores = teamScores(self)

    else:
        _scores = normalScores(self)


    self.info("Scores: " + str(_scores))


    for (i, player) in enumerate(self.players):
        player["scores"].append(_scores[i])

    self.dispatchPublicState("getState")





def nextGame(self):
    if self.stage != "roundFinished":
        self.error("Illegal request - game is not finished")       
        return None

    self.info("Starting new game")
    self.initGame(self.players)
    self.dispatchPublicState("getState")
