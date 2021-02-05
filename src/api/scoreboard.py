from __main__ import sio
import json
from util import score





def concludeGame(self):
    self.info("Game over")
    self.stage = "roundFinished"

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
    #sio.emit("getState", json.dumps(self.results), broadcast=True, room=self.room)
    self.dispatchPublicState("getState")





def nextGame(self):
    if self.stage != "roundFinished":
        self.error("Illegal request - game is not finished")       
        return None

    self.info("Starting new game")
    self.initGame(self.players)
    self.dispatchPublicState("getState")
