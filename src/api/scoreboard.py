from __main__ import sio
from util import score
import json




def individualScores(players):
    return [score(p["cardsWon"]) for p in players]



def sumScores(s):
    return sum(item[1] for item in s["breakdown"])


# returns index of pagat ultimo player if exists,
# otherwise -1
def pagatUltimoIndex(players):
    for i, p in enumerate(players):
        if p["boni"] != [] and "pagat_ultimo" in p["boni"]:
            return i
    return -1



# mutates scores, adds earned bonus to each team's scores
def addBonus(teams, players):

    # Pagat Ultimo
    pagatPlayer = pagatUltimoIndex(players)
    for team in teams:
        if pagatPlayer in team["players"]:
            team["breakdown"] += [["Pagat Ultimo", 25]]

    # Valat
    for team in teams:
        if all(t["cardsWon"] == [] for t in teams if t != team):
            team["breakdown"] += [["Valat", 250]]

    # Kralji
    kings = ["kara_kralj", "srce_kralj", "pik_kralj", "kriz_kralj"]
    for team in teams:
        if all(king in team["cardsWon"] for king in kings):
            team["breakdown"] += [["Kralji", 10]]

    # Trula / TrulaPagat
    trula = ["tarok_1", "tarok_21", "tarok_22"]
    for team in teams:
        if all(card in team["cardsWon"] for card in trula):
            if pagatPlayer in team["players"]:
                # replace pagat ultimo bonus with Trulapagat
                team["breakdown"] = [entry for entry in team["breakdown"] if entry[0] != "Pagat Ultimo"]
                team["breakdown"] += [["Trulapagat", 50]]
            else:
                team["breakdown"] += [["Trula", 10]]

    return teams






def teamScores(self):
    # player who called gameType
    playerTeam = {
        "players": [self.gameType["player"]],
        "breakdown": [], # ["bonus", amount]
        "cardsWon": []
    }

    # and his (potential) teammate
    if "with" in self.gameType and self.gameType["with"] != -1:
        playerTeam["players"].append(self.gameType["with"])

    # opposing team: everyone else
    opposingTeam = {
        "players": [i for i in range(len(self.players)) if i not in playerTeam["players"]],
        "breakdown": [],
        "cardsWon": []
    }

    self.info("Teams: " + str(playerTeam["players"]) + " vs " + str(opposingTeam["players"]))

    # cards won by either team
    for i, p in enumerate(self.players):
        if i in playerTeam["players"]:
            playerTeam["breakdown"] += [[p["name"], score(p["cardsWon"])]]
            playerTeam["cardsWon"] += p["cardsWon"]
        else:
            opposingTeam["breakdown"] += [[p["name"], score(p["cardsWon"])]]
            opposingTeam["cardsWon"] += p["cardsWon"]

    # add talon cards
    talonFlat = self.talon
    if type(talonFlat[0]) == list:
        talonFlat = [c for pack in self.talon for c in pack]

    if "king" in self.gameType and len(playerTeam) == 1:
        if self.gameType["king"] in self.players[playerTeam[0]]["cardsWon"]:
            # if player played alone and won the called king, add talon to his card pile
            playerTeam["breakdown"] += [["Talon", score(talonFlat)]]
            playerTeam["cardsWon"] += talonFlat
    else:
        # in every other case, add it to opposing team
        opposingTeam["breakdown"] += [["Talon", score(talonFlat)]]
        opposingTeam["cardsWon"] += talonFlat

    # handle other contracts 
    addBonus([playerTeam, opposingTeam], self.players)

    # sum scores
    playerTeam["sum"]   = sumScores(playerTeam)
    opposingTeam["sum"] = sumScores(opposingTeam)

    return [playerTeam, opposingTeam]



def beracScores(self):
    assert self.gameType["name"] in ["berac", "odprti_berac"]

    completed = self.players[self.gameType["player"]]["cardsWon"] == []

    def getScore(self, i, completed):
        if i == self.gameType["player"]:
            return 70 if completed else -70
        else:
            return 0

    return [{
        "players": [i],
        "cardsWon": p["cardsWon"],
        "breakdown": [
            ["berac", 70 if completed else -70 ] if i == self.gameType["player"] else []
        ],
        "sum": getScore(self, i, completed)
    } for i,p in enumerate(self.players)]




def pikoloScores(self):
    assert self.gameType["name"] == "pikolo"

    roundsWon = len(self.players[self.gameType["player"]]["cardsWon"]) / len(self.players)
    completed = roundsWon < 2

    def getScore(self, i, completed):
        if i == self.gameType["player"]:
            return 60 if completed else -60
        else:
            return 0

    return [{
        "players": [i],
        "cardsWon": p["cardsWon"],
        "breakdown": [
            ["pikolo", 60 if completed else -60 ] if i == self.gameType["player"] else []
        ],
        "sum": getScore(self, i, completed)
    } for i,p in enumerate(self.players)]
    return None



def klopScores(self):
    assert self.gameType["name"] == "klop"
    return None




def normalScores(self):
    return [{
        "players": [i],
        "cardsWon": p["cardsWon"],
        "breakdown": [[p["name"], score(p["cardsWon"])]],
        "sum": score(p["cardsWon"])
    } for i, p in enumerate(self.players)]



def concludeGame(self):
    self.info(" - Round finished - ")
    self.stage = "roundFinished"

    gt = self.gameType["name"]

    if gt in ["ena", "dva", "tri", "solo_ena", "solo_dva", "solo_tri", "solo_brez"]:
        _scores = teamScores(self)
    elif gt in ["berac", "odprti_berac"]:
        _scores = beracScores(self)
    elif gt == "pikolo":
        _scores = pikoloScores(self)
    elif gt == "klop":
        _scores = normalScores(self) # TODO
    else: 
        _scores = normalScores(self)


    self.info("Scores: " + str(_scores))

    self.recentScores = _scores


    # append sum of scores to each player's history
    for team in _scores:
        for player in team["players"]:
            self.players[player]["scores"].append(team["sum"])

    self.dispatchPublicState("getState")





def nextGame(self):
    if self.stage != "roundFinished":
        self.error("Illegal request - game is not finished")       
        return None

    self.info("Starting new game")
    self.initGame(self.players)
    self.dispatchPublicState("getState")
