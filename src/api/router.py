from lobby import Lobby
from flask import request

class Router:


    def __init__(self):
        # list of lobbies currently active
        # TODO: periodically remove dead lobbies
        self.lobbies = []

        # hash table mapping user ID to lobby index
        self.lobbyTable = dict()
        self.lobbies.append(Lobby("first_lobby"))


    
    def createRoom():
        id = "first_room" # TODO: randomly generate
        self.lobbies.append(Lobby(id))


    def lobbyLookup(self, sid):
        return self.lobbies[self.lobbyTable[sid]]


    def getLobbies(self):
        # TODO: rename lobby property
        return [
            {
                "id": lob.room,
                "players": [
                    p["name"] for p in lob.lobby 
                ]
            } for lob in self.lobbies
        ]




    def joinLobby(self, name, lobbyId):
        lobbyIndex = -1
        for i, lobby in enumerate(self.lobbies):
            if lobby.room == lobbyId:
                lobbyIndex = i
                break

        if lobbyIndex != -1:
            # lobby exists, add user to lobby
            self.lobbyTable[request.sid] = lobbyIndex
            self.lobbies[lobbyIndex].join(name)
        else:
            # TODO: lobby does not exist, create it instead
            print("Lobby does not exist. Creating new lobby.")
            self.lobbies.append(Lobby(lobbyId))
            lobbyIndex = len(self.lobbies) - 1
            self.lobbyTable[request.sid] = lobbyIndex
            self.lobbies[lobbyIndex].join(name)



    def leaveLobby(self):
        if request.sid in self.lobbyTable:
            self.lobbyLookup(request.sid).disconnect()
            #del lobbyTable[request.sid]

    def getUsers(self):
        if request.sid in self.lobbyTable:
            self.lobbyLookup(request.sid).dispatchLobbyState()


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


    #def forward(self, sid, func, args):
        #func(self.lobbyLookup(sid)

