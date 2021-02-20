from flask import Flask, request
from flask_socketio import SocketIO, send, join_room, leave_room
import json
import logging

app = Flask(__name__)
app.config["SECRET_KEY"] = "sekret"
logging.getLogger("werkzeug").disabled = True

#TODO: preveri če ima kratek ping interval težave s performanco
sio = SocketIO(app, cors_allowed_origins="*", ping_timeout=2, ping_interval=2) 


from lobby import Lobby
from router import Router

R = Router()


@sio.on("getLobbies")
def handleGetLobbies():
    lobbies = json.dumps(R.getLobbies())
    sio.emit("getLobbies", lobbies, room=request.sid)


@sio.on("getUsers")
def handleGetLobby(id):
    lobby = R.getLobby(id)
    sio.emit("getUsers", lobby, room=request.sid)


#@sio.on("getUsers")
#def handleGetUsers():
    #R.getUsers()

@sio.on("createLobby")
def handleCreateLobby():
    newID = R.createLobby()
    sio.emit("createLobby", newID, room=request.sid)

@sio.on("join")
def handleJoin(name, lobbyId):
    R.joinLobby(name, lobbyId)


@sio.on("ready")
def handleReady(msg):
    R.ready(msg)


@sio.on("disconnect")
def handleDisconnect():
    R.leaveLobby()


@sio.on("getState")
def handleGetState():
    R.getState()


@sio.on("playCard")
def handlePlayCard(card):
    R.playCard(card)


@sio.on("chat")
def handleChat(msg):
    R.chat(msg)


@sio.on("gameType")
def handleGameType(gameType):
    R.playGameType(gameType)


@sio.on("chooseKing")
def handleChooseKing(king):
    R.chooseKing(king)


@sio.on("chooseTalon")
def handleChooseTalon(index):
    R.chooseTalon(index)


@sio.on("talonSwap")
def handleTalonSwap(card):
    R.talonSwap(card)



if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", port=5000)
