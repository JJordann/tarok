from __main__ import sio
from flask import request
from flask_socketio import join_room, leave_room
import json
from game import Game


class Lobby:
    def __init__(self, room):
        self.room = room
        self.lobby = []
        self.game = Game(room)

    def isInactive(self):
        if self.lobby == []:
            return True
        else:
            return self.game.isInactive()

    def join(self, name, uid):
        if self.game.stage == "lobby":
            self.lobby.append({
                "name": name, 
                "uid": uid, 
                "sid": request.sid, 
                "ready": False
            })
            self.dispatchLobbyState()
            join_room(self.room)
        else:
            self.game.error("Unable to join -- Game has already started")
            return None

    def disconnect(self):
        # If game has not started yet leave lobby
        if self.game.stage == "lobby":
            self.lobby = [u for u in self.lobby if u["sid"] != request.sid]
            self.dispatchLobbyState()
        else:
            self.game.leave()

        leave_room(self.room)

    # reconnect user with provided uid
    # returns old SID if successful
    def reconnect(self, uid):
        for player in self.lobby:
            if player["uid"] == uid:
                player["sid"] = request.sid
                # TODO: remove self.lobby, 
                # use self.game.players instead
                for p in self.game.players:
                    if p["uid"] == uid:
                        oldSID = p["sid"]
                        p["sid"] = request.sid
                        return oldSID
        return ""


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
            try:
                msg[i][2] = True
                sio.emit("getUsers", msg, room=self.lobby[i]["sid"])
                msg[i][2] = False
            except IndexError:
                pass

    def sendChat(self, msg):
        sender = next(p for p in self.lobby if p["sid"] == request.sid)["name"]
        print(sender, "> ", msg)
        sio.emit("chat", json.dumps({"sender": sender, "message": msg}), room=self.room)

        if msg == "!next":
            self.game.nextGame()
