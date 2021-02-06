from __main__ import sio
import json
from util import score





def concludeGame(self):
    self.info("Game over")
    self.stage = "roundFinished"

    _scores = []
    for player in self.players:
        _scores.append(score(player["cardsWon"]))


    if "king" in self.gameType and self.gameType["with"] != self.gameType["player"]:
        # a king was called, add scores of player with index "player" and "with"
        _scores[self.gameType["player"]] += _scores[self.gameType["with"]]
        _scores[self.gameType["with"]]    = _scores[self.gameType["player"]]

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
