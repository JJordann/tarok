import json
import random
import string
from lobby import Lobby
from flask import request
from flask_socketio import leave_room
from __main__ import sio


class Router:
    def __init__(self):
        # list of lobbies currently active
        self.lobbies = []

        # hash table mapping user ID to lobby index
        # sessionId -> Lobby
        self.lobbyTable = dict()

    def lobbyLookup(self, sid):
        return self.lobbyTable[sid]

    def getLobbies(self):
        # TODO: rename lobby property
        return [
            {"id": lob.room, "players": [p["name"] for p in lob.lobby]}
            for lob in self.lobbies
        ]

    def getLobby(self, id):
        for lob in self.lobbies:
            if lob.room == id:
                return [[u["name"], u["ready"], False] for u in lob.lobby]
        return []

    def reconnect(self, uid):
        for l in self.lobbies:
            oldSID = l.reconnect(uid)
            if oldSID != "":
                # if reconnect was successful (player was found)
                # stop searching, get state of game, emit reconnect
                sio.emit("reconnect", l.game.stage, room=request.sid)
                print("reconnect request: ", uid, " action: ", l.game.stage)
                # update hash table
                self.lobbyTable[request.sid] = self.lobbyTable[oldSID]
                if oldSID in self.lobbyTable:
                    del self.lobbyTable[oldSID]
                return
        # reconnect was unsuccessful (player was not in an active game)
        sio.emit("reconnect", "inactive", room=request.sid)
        print("reconnect request: ", uid, " action: inactive")



    def createLobby(self):
        newID = "room" + str(len(self.lobbies))
        self.lobbies.append(Lobby(newID))
        self.broadcastLobbyChange()
        return newID

    # generates random 16 character string
    def generateID(self, size=16, chars=string.ascii_uppercase + string.digits):
        return ''.join(random.choice(chars) for _ in range(size))

    def joinLobby(self, name, lobbyId):
        lobbyIndex = -1
        for i, lobby in enumerate(self.lobbies):
            if lobby.room == lobbyId:
                lobbyIndex = i
                break

        if lobbyIndex != -1:
            # TODO: move this to allReady()
            # generate connection ID to store on client
            uid = self.generateID()
            sio.emit("connectionID", uid, room=request.sid)

            # lobby exists, add user to lobby
            self.lobbyTable[request.sid] = self.lobbies[lobbyIndex]
            self.lobbies[lobbyIndex].join(name, uid)
            leave_room("watchingLobbies")
            self.broadcastLobbyChange()
        else:
            print("Lobby does not exist.")

    def broadcastLobbyChange(self):
        sio.emit("getLobbies", json.dumps(self.getLobbies()), room="watchingLobbies")

    def leaveLobby(self):
        if request.sid in self.lobbyTable:
            self.lobbyLookup(request.sid).disconnect()
            if self.lobbyLookup(request.sid).isInactive():
                # game is inactive, remove it
                # along with all associated hash table entries
                idToRemove = self.lobbyLookup(request.sid).room
                self.lobbyTable = {
                    k: v for k, v in self.lobbyTable.items() if v.room != idToRemove
                }
                self.lobbies = [l for l in self.lobbies if l.room != idToRemove]
        self.broadcastLobbyChange()

    # def getUsers(self):
    # if request.sid in self.lobbyTable:
    # self.lobbyLookup(request.sid).dispatchLobbyState()

    def ready(self, msg):
        self.lobbyLookup(request.sid).ready(msg)

    def getState(self):
        self.lobbyLookup(request.sid).game.getCards()

    def chat(self, msg):
        self.lobbyLookup(request.sid).sendChat(msg)

    def playCard(self, card):
        self.lobbyLookup(request.sid).game.handlePlayCard(card)

    def playGameType(self, gameType):
        self.lobbyLookup(request.sid).game.playGameType(gameType)

    def chooseKing(self, king):
        self.lobbyLookup(request.sid).game.chooseKing(king)

    def chooseTalon(self, index):
        self.lobbyLookup(request.sid).game.chooseTalon(index)

    def talonSwap(self, card):
        self.lobbyLookup(request.sid).game.talonSwap(card)

    # def forward(self, sid, func, args):
    # func(self.lobbyLookup(sid)
