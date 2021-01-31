from flask import Flask, request
from flask_socketio import SocketIO, send, join_room, leave_room
import json
import logging

from deck import *
from util import *


app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'
logging.getLogger('werkzeug').disabled = True
socketIo = SocketIO(app, cors_allowed_origins="*")


connected = []




if False: """
GameState:
    table
    talon
    players:
        name
        sid
        hand
        cardsWon
        turn
"""


mockCon = [
    {
        "name": "Prvyyy",
        "sid": "1111111111",
        "ready": True
    },
    {
        "name": "Drugyy",
        "sid": "2222222222",
        "ready": True
    },
    {
        "name": "Tretyyy",
        "sid": "3333333333",
        "ready": True
    },
    {
        "name": "Czetrtyyy",
        "sid": "4444444444",
        "ready": True
    }
]


def playable(hand):
    return None


@socketIo.on("getState")
def handleGetCards():
    global gameState
    sender = next(p for p in gameState["players"] if p["sid"] == request.sid)
    playerState = {
        "table": gameState["table"],
        "players": [u["name"] for u in gameState["players"]],
        "hand": sender["hand"],
        "playable": [],
        "cardsWon": sender["cardsWon"],
        "turn": sender["turn"]
    }
    print(playerState)
    socketIo.emit("getState", json.dumps(playerState))




def sendUnicasts(connected):
    msg = [[u["name"], u["ready"], False] for u in connected]
    for i in range(0, len(connected)):
        msg[i][2] = True
        socketIo.emit("getUsers", msg, room=connected[i]["sid"])
        print(msg)
        msg[i][2] = False

def startGame(connected):
    (talon, hands) = dealCards(deck, connected)
    for i in range(0, len(connected)):
        socketIo.emit("getCards", hands[i], room=connected[i]["sid"])


@socketIo.on("join")
def handleJoin(msg):
    print("JOIN: #### " + msg + " ####" + request.sid + "####")
    connected.append({"name": msg, 
                      "sid": request.sid,
                      "ready": False})
    sendUnicasts(connected)
    join_room("joined")
    print(connected)


@socketIo.on("ready")
def handleReady(msg):
    global connected
    for u in connected:
        if u["sid"] == request.sid:
            u["ready"] = True if (msg == "true") else False
            if allReady(connected) == True:
                handleAllReady()
    sendUnicasts(connected)
    return None
    

def allReady(connected):
    return all(map(lambda x: x["ready"], connected))


def handleAllReady():
    global connected
    print("****** ALL READY ****** ")
    socketIo.emit("allReady", room="joined")
    global gameState
    gameState = initGame(deck, connected)


@socketIo.on("getUsers")
def getUsers():
    global connected
    sendUnicasts(connected)


@socketIo.on("disconnect")
def handleLeave():
    print(request.sid + " left")
    global connected
    connected = [u for u in connected if u["sid"] != request.sid]
    sendUnicasts(connected)
    leave_room("joined")
    print(connected)


if __name__ == '__main__':
    socketIo.run(app)


