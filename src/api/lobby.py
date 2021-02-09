from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room

from game import Game

class Lobby:
    def __init__(self, room):
        self.room = room
        self.lobby = []
        self.game = Game(room)
    


    def join(self, name):
        self.lobby.append({"name": name, 
                            "sid": request.sid,
                            "ready": False})
        self.dispatchLobbyState()
        join_room(self.room)
    


    def disconnect(self):
        # If game has not started yet leave lobby
        if self.game.stage == "lobby":
            self.lobby = [u for u in self.lobby if u["sid"] != request.sid]
            self.dispatchLobbyState()
        else:
            self.game.leave()
        
        leave_room(self.room)
    


    def ready(self, msg):
        for u in self.lobby:
            if u["sid"] == request.sid:
                u["ready"] = True if (msg == "true") else False
                if self.allReady() == True:
                    self.handleAllReady()
        self.dispatchLobbyState()
    


    def allReady(self):
        return all(map(lambda x: x["ready"], self.lobby))
    


    def handleAllReady(self):
        if len(self.lobby) in [3, 4]:
            print("ALL READY")
            sio.emit("allReady", room=self.room)
            # Start game
            self.game.initGame(self.lobby)
        else:
            if len(self.lobby) < 3:
                self.game.info("waiting for " + str(3 - len(self.lobby)) + " more players to join")
            else:
                self.game.info("waiting for " + str(len(self.lobby) - 4) + " players to leave")
    


    def dispatchLobbyState(self):
        msg = [[u["name"], u["ready"], False] for u in self.lobby]
        for i in range(0, len(self.lobby)):
            msg[i][2] = True
            sio.emit("getUsers", msg, room=self.lobby[i]["sid"])
            msg[i][2] = False