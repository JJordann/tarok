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


lobbies = [Lobby("first_lobby")]

# hash table mapping user ID to lobby index
lobbyTable = dict()

def lobbyLookup(sid):
    global lobbies
    return lobbies[lobbyTable[sid]]

#lobby = Lobby("joined")


@sio.on("getUsers")
def handleGetUsers():
    if request.sid in lobbyTable:
        lobbyLookup(request.sid).dispatchLobbyState()


@sio.on("join")
def handleJoin(name):
    lobbyTable[request.sid] = 0
    lobbyLookup(request.sid).join(name)


@sio.on("ready")
def handleReady(msg):
    lobbyLookup(request.sid).ready(msg)


@sio.on("disconnect")
def handleDisconnect():
    if request.sid in lobbyTable: 
        lobbyLookup(request.sid).disconnect()
        del lobbyTable[request.sid]


@sio.on("getState")
def handleGetState():
    lobbyLookup(request.sid).game.getCards()


@sio.on("playCard")
def handlePlayCard(card):
    lobbyLookup(request.sid).game.handlePlayCard(card)


@sio.on("chat")
def handleChat(msg):
    lobbyLookup(request.sid).sendChat(msg)


@sio.on("gameType")
def handleGameType(gameType):
    lobbyLookup(request.sid).game.playGameType(gameType)


@sio.on("chooseKing")
def handleChooseKing(king):
    lobbyLookup(request.sid).game.chooseKing(king)


@sio.on("chooseTalon")
def handleChooseTalon(index):
    lobbyLookup(request.sid).game.chooseTalon(index)


@sio.on("talonSwap")
def handleTalonSwap(card):
    lobbyLookup(request.sid).game.talonSwap(card)



if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", port=5000)
