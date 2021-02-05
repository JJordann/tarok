from __main__ import sio
import json
from util import score





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
    sio.emit("gameOver", json.dumps(self.results), broadcast=True, room=self.room)

    self.info("Game over")
    self.info("Starting new game")

    self.initGame(self.players)
    self.dispatchPublicState("getState")