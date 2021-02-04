from flask import Flask, request
from flask_socketio import SocketIO, send, join_room, leave_room
import json
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'
logging.getLogger('werkzeug').disabled = True
sio = SocketIO(app, cors_allowed_origins="*")

from lobby import Lobby

lobby = Lobby("joined")

@sio.on("getUsers")
def handleGetUsers():
    lobby.dispatchLobbyState()



@sio.on("join")
def handleJoin(name):
    lobby.join(name)



@sio.on("ready")
def handleReady(msg):
    lobby.ready(msg)



@sio.on("disconnect")
def handleDisconnect():
    lobby.disconnect()


@sio.on("getState")
def handleGetState():
    lobby.game.getCards()


@sio.on("playCard")
def handlePlayCard(card):
    lobby.game.handlePlayCard(card)


@sio.on("chat")
def handleChat(msg):
    lobby.game.sendChat(msg)

@sio.on("gameType")
def handleGameType(gameType):
    lobby.game.playGameType(gameType)



#@sio.on("contract")
#def handleContract(contract):
    #lobby.game.playContract(contract)


if __name__ == '__main__':
    sio.run(app, host='0.0.0.0', port=5000)