from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room


class Game:

    def __init__(self):
        self.connected = []
        self.room = "joined"


    def join(self, name):
        self.connected.append({"name": name, 
                               "sid": request.sid,
                               "ready": False})
        self.dispatchLobbyState()
        join_room(self.room)
        return None



    def ready(self, msg):
        for u in self.connected:
            if u["sid"] == request.sid:
                u["ready"] = True if (msg == "true") else False
                if self.allReady() == True:
                    self.handleAllReady()
        self.dispatchLobbyState()
        return None
    


    def allReady(self):
        return all(map(lambda x: x["ready"], self.connected))



    def handleAllReady(self):
        print("****** ALL READY ****** ")
        sio.emit("allReady", room="joined")
        #global gameState
        #gameState = initGame(deck, connected)



    def disconnect(self):
        self.connected = [u for u in self.connected if u["sid"] != request.sid]
        self.dispatchLobbyState()
        leave_room(self.room)
        return None



    def dispatchLobbyState(self):
        msg = [[u["name"], u["ready"], False] for u in self.connected]
        for i in range(0, len(self.connected)):
            msg[i][2] = True
            sio.emit("getUsers", msg, room=self.connected[i]["sid"])
            msg[i][2] = False