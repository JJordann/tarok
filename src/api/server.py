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


@socketIo.on("chat")
def handleChat(msg):
    sender = findPlayerBySid(gameState, request.sid)["name"]
    print(msg)
    socketIo.emit("chat", json.dumps({"sender": sender, "message": msg}), room="joined")




def broadcastResults(res):
    socketIo.emit("gameOver", res, room="joined")



@socketIo.on("playCard")
def handlePlayCard(card):
    global gameState
    gameState = playCard(gameState, card, request.sid)
    dispatchPublicState(gameState)

    if all(len(p["hand"]) == 0 for p in gameState["players"]):
        results =  concludeGame(gameState)
        broadcastResults(results)



@socketIo.on("getState")
def handleGetCards():
    global gameState
    playerState = getPublicState(gameState, request.sid)
    socketIo.emit("getState", json.dumps(playerState), room=request.sid)



def dispatchPublicState(gameState):
    for player in gameState["players"]:
        playerState = getPublicState(gameState, player["sid"])
        socketIo.emit("getState", json.dumps(playerState), room=player["sid"])



def findPlayerBySid(gameState, sid):
    return next(p for p in gameState["players"] if p["sid"] == sid)



def getPublicState(gameState, sid):
    player = findPlayerBySid(gameState, sid)
    return {
        "myName": player["name"],
        "table": gameState["table"],
        "players": [u["name"] for u in gameState["players"]],
        "hand": player["hand"],
        "playable": playable(player["hand"], gameState["table"]),
        "cardsWon": player["cardsWon"],
        "turn": player["turn"]
    }



def dispatchLobbyState(connected):
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
    connected.append({"name": msg, 
                      "sid": request.sid,
                      "ready": False})
    dispatchLobbyState(connected)
    join_room("joined")



@socketIo.on("ready")
def handleReady(msg):
    global connected
    for u in connected:
        if u["sid"] == request.sid:
            u["ready"] = True if (msg == "true") else False
            if allReady(connected) == True:
                handleAllReady()
    dispatchLobbyState(connected)
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
    dispatchLobbyState(connected)



@socketIo.on("disconnect")
def handleLeave():
    global connected
    connected = [u for u in connected if u["sid"] != request.sid]
    dispatchLobbyState(connected)
    leave_room("joined")


if __name__ == '__main__':
    socketIo.run(app)


