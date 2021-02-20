from lobby import Lobby
from flask import request

class Router:


    def __init__(self):
        # list of lobbies currently active
        # TODO: periodically remove dead lobbies
        self.lobbies = []

        # hash table mapping user ID to lobby index
        #TODO: spremeni hash table v sid -> Lobby (lažje brisanje)
        self.lobbyTable = dict()

        self.lobbies.append(Lobby("first_lobby"))
        self.lobbies.append(Lobby("lobby2"))
        self.lobbies.append(Lobby("lobby3"))


    
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


    def getLobby(self, id):
        for lob in self.lobbies:
            if lob.room == id:
                return [
                    [u["name"], u["ready"], False]
                    for u in lob.lobby
                ]
        return []


    def createLobby(self):
        newID = "room" + str(len(self.lobbies))
        self.lobbies.append(Lobby(newID))
        #lobbyIndex = len(self.lobbies) - 1
        #self.lobbyTable[request.sid] = lobbyIndex
        #self.lobbies[lobbyIndex].join(name)
        # return new ID to be emitted
        return newID
        


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
            # TODO: separate function to create lobby
            print("Lobby does not exist.")
            #self.lobbies.append(Lobby(lobbyId))
            #lobbyIndex = len(self.lobbies) - 1
            #self.lobbyTable[request.sid] = lobbyIndex
            #self.lobbies[lobbyIndex].join(name)



    def leaveLobby(self):
        if request.sid in self.lobbyTable:
            self.lobbyLookup(request.sid).disconnect()
            #del lobbyTable[request.sid]

    #def getUsers(self):
        #if request.sid in self.lobbyTable:
            #self.lobbyLookup(request.sid).dispatchLobbyState()


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

