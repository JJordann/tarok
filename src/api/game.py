from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room
import json

from deck import *
from util import *
from contracts import *
from chat import *
from talonSwap import *
from scoreboard import *


class Game:

    def __init__(self, room):
        # contracts
        Game.playGameType = playGameType
        # talonSwap
        Game.showTalon = showTalon
        Game.chooseTalon = chooseTalon
        Game.talonSwap = talonSwap
        Game.chooseKing = chooseKing
        # chat
        Game.sendChat = sendChat
        # scoreboard
        Game.concludeGame = concludeGame
        Game.nextGame = nextGame
        #
        self.room = room
        self.players = []
        self.stage = "lobby"



    def error(self, msg):
        print("ERROR>", msg)
        sio.emit("ERROR", msg, room=self.room)



    def info(self, msg):
        print("INFO>", msg)
        sio.emit("INFO", msg, room=self.room)



    def leave(self):
        self.players = [u for u in self.players if u["sid"] != request.sid]
        self.dispatchGameLobbyState()
    


    def startingPlayer(self):
        return len(self.players[0]["scores"]) % len(self.players) if "scores" in self.players[0] else 0



    def lastPlayer(self):
        return (self.startingPlayer() - 1) % len(self.players)



    def passTurn(self):
        self.turn = (self.turn + 1) % len(self.players)



    def dispatchGameLobbyState(self):
        msg = [[u["name"], u["ready"], False] for u in self.players]
        for i in range(0, len(self.players)):
            msg[i][2] = True
            try: 
                sio.emit("getUsers", msg, room=self.players[i]["sid"])
            except IndexError:
                print("Handled disconnect gracefully")
            msg[i][2] = False




    def initGame(self, players):
        # Hand over players from lobby to game state 
        self.players = players

        (talon, hands) = dealCards(deck, len(self.players))
        self.turn = self.startingPlayer()
        self.talon = talon
        self.gameType = [
            {
                "name": "choosing",
                "player": i
            } for (i, p) in enumerate(self.players)
        ]
        self.table = []
        self.stage = "gameType"
        self.players = [
                {
                    "index": i,
                    "name": p["name"],
                    "sid": p["sid"],
                    "hand": hands[i],
                    "ready": True,
                    "cardsWon": [],
                    "boni": [],
                    "contracts": [],
                    "scores": p["scores"] if "scores" in p.keys() else []
                } for (i, p) in enumerate(self.players)
        ]



    def getCards(self):
        playerState = self.getPublicState(request.sid)
        sio.emit("getState", json.dumps(playerState), room=request.sid)




    def getPublicState(self, sid):
        playerIndex = next(i for i,v in enumerate(self.players) if v["sid"] == sid)
        player = self.players[playerIndex]
        
        _playable = []
        if self.turn == playerIndex and self.stage == "active":
            _playable = playable(player["hand"], cards(self.table), len(self.players), self.gameType["name"])
        elif self.turn == playerIndex and self.stage == "talonSwap":
            _playable = player["hand"]
        
        publicState =  {
            "stage": self.stage,
            "turn": self.turn,
            "myIndex": playerIndex,
            "table": self.table,
            "players": [{
                "index": p["index"],
                "name": p["name"],
                "contracts": p["contracts"],
                "scores": p["scores"] if "scores" in p.keys() else []
            } for p in self.players],
            "hand": player["hand"],
            "playable": _playable,
            "cardsWon": player["cardsWon"]
        }

        if type(self.gameType) == list:
            publicState["gameType"] = self.gameType
        else:
            publicState["gameType"] = {
                "name": self.gameType["name"],
                "player": self.gameType["player"],
            }
            if "king" in self.gameType:
                publicState["gameType"]["king"] = self.gameType["king"]
            if "revealed" in self.gameType and self.gameType["revealed"] == True:
                publicState["gameType"]["with"] = self.gameType["with"]


        if self.stage == "gameType":
            isPlayerLast = self.turn == self.lastPlayer()
            publicState["playableGames"] = playableGames(self.gameType, isPlayerLast, len(self.players))


        if self.stage in ["chooseTalon", "talonSwap"]:
            publicState["talon"] = self.talon

        if self.stage == "talonSwap":
            # player can swap any card valued below 5
            publicState["playable"] = [c for c in self.players[self.turn]["hand"] if cardValue(c) < 5]


        if self.stage == "roundFinished":
            publicState["recentScores"] = self.recentScores

        if self.stage == "active" and self.gameType["name"] == "odprti_berac":
            beracHand = self.players[self.gameType["player"]]["hand"]
            publicState["gameType"]["beracHand"] = beracHand
            self.info("Berač hand: " + str(beracHand))

        #if self.stage == "contracts":
            #publicState["playableContracts"] = playableContracts(self) + ["naprej"]

        return publicState




    def dispatchPublicState(self, event):
        for player in self.players:
            playerState = self.getPublicState(player["sid"])
            sio.emit(event, json.dumps(playerState), room=player["sid"])




    def getPlayerIndex(self, sid):
        for i, p in enumerate(self.players):
            if p["sid"] == sid:
                return i
        return -1




    def handlePlayCard(self, card):
        isOver = self.playCard(card, request.sid)
        self.dispatchPublicState("getState")

        if self.isOverEarly() or isOver:
            self.concludeGame()




    def isOverEarly(self):
        if self.gameType["name"] in ["berac", "odprti_berac"]:
            if self.players[self.gameType["player"]]["cardsWon"] != []:
                # Berac player won cards, game is over
                self.info("Berac player takes - game is over")
                return True

        elif self.gameType["name"] == "pikolo":
            numRoundsWon = len(self.players[self.gameType["player"]]["cardsWon"]) / len(self.players)
            if numRoundsWon > 1:
                self.info("Pikolo player takes second round - game is over")
                return True

        return False




    def playCard(self, card, player):
        playerIndex = self.getPlayerIndex(player)

        if self.turn != playerIndex:
            self.error("Illegal move - It's not your turn")
            return False

        if card not in playable(self.players[playerIndex]["hand"], cards(self.table), len(self.players), self.gameType["name"]):
            self.error("Illegal move - Stop Hacking")
            return False

        nPlayers = len(self.players)

        # transfer played card from hand to table
        self.table.append({"card": card, "player": playerIndex})
        self.players[playerIndex]["hand"].remove(card)

        # if called king was played, reveal player
        if "king" in self.gameType and card == self.gameType["king"]:
            self.gameType["revealed"] = True

        # transfer turn to next player
        self.passTurn()

        if len(self.table) < nPlayers:
            # round is not over
            self.dispatchPublicState("getState")
            return False
        
        # round is over, transfer table to round winner
        takesIndex = takes(cards(self.table))
        takesPlayer = ((playerIndex - (nPlayers - 1)) % nPlayers + takesIndex) % nPlayers
        self.players[takesPlayer]["cardsWon"] += cards(self.table)

        # log round
        msg = str(self.players[takesPlayer]["name"]) + " takes -- " + self.table[takesIndex]["card"] + " takes " + str(cards(self.table))
        self.info(msg)

        if all(len(p["hand"]) == 0 for p in self.players):
            # players have no cards, game ends
            # check for pagat ultimo
            pagatIndex = pagatUltimo(cards(self.table))
            if pagatIndex > -1:
                pagatPlayer = ((playerIndex - (nPlayers - 1)) % nPlayers + pagatIndex) % nPlayers
                self.players[pagatPlayer]["boni"] += ["pagat_ultimo"]
                self.info("PAGAT ULTIMO: " + self.players[pagatPlayer]["name"])
            return True

        # player who takes begins next round
        self.turn = takesPlayer
        self.table = []
        return False






