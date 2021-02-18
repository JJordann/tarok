from lobby import Lobby


class Router:

    # list of lobbies currently active
    # TODO: periodically remove dead lobbies
    self.lobbies = []

    # hash table mapping user ID to lobby index
    self.lobbyTable = [] 

    def __init__(self):
        pass

    
    def createRoom():
        id = "first_room" # TODO: randomly generate
        self.lobbies.append(Lobby(id))


    def roomLookup(self, sid):
        pass


