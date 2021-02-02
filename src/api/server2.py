from flask import Flask, request
from flask_socketio import SocketIO, send, join_room, leave_room
import json
import logging

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'
logging.getLogger('werkzeug').disabled = True
sio = SocketIO(app, cors_allowed_origins="*")


from game import Game

game1 = Game()


@sio.on("getUsers")
def handleGetUsers():
    game1.dispatchLobbyState()



@sio.on("join")
def handleJoin(name):
    game1.join(name)



@sio.on("ready")
def handleReady(msg):
    game1.ready(msg)



@sio.on("disconnect")
def handleDisconnect():
    game1.disconnect()


@sio.on("getState")
def handleGetState():
    game1.getCards()








if __name__ == '__main__':
    sio.run(app, host='0.0.0.0', port=5000)