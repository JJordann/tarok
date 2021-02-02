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


# ----------- CONTRACTS ---------------------------------------------------


def addContract(gameState, sid, contract):
    sidIndex = next(i for i,v in enumerate(gameState["players"]) if v["sid"] == sid)
    gameState["players"][sidIndex]["contracts"] += [contract]
    return gameState



# returns index of player who is currently choosing contract,
# or -1 if all have chosen
def finishContracts(gameState):
    contracts = [p["contracts"] for p in gameState["players"]]
    done = all([len(c) > 0 and c[-1] == "naprej" for c in contracts])
    # every player recently skipped
    if done:
        gameState["phase"] = "active"
    return gameState




@socketIo.on("contract")
def handleContract(contract):
    global gameState

    sender = findPlayerBySid(gameState, request.sid)
    if sender["turn"] == False:
        print("It's not your turn. Stop hacking.")
        return gameState

    gameState = addContract(gameState, request.sid, contract)
    playerIndex = gameState["players"].index(sender)

    # transfer turn to next player
    gameState["players"][playerIndex]["turn"] = False
    gameState["players"][(playerIndex + 1) % len(gameState["players"])]["turn"] = True

    for player in gameState["players"]:
        print(player["name"], ": ", player["contracts"])

    if contract != "naprej":
        msg = sender["name"] + " played " + contract
        socketIo.emit("INFO", msg, room="joined")

    gameState = finishContracts(gameState)
    dispatchPublicState("getState", gameState)
    return None




# ----------- CHAT --------------------------------------------------------


@socketIo.on("chat")
def handleChat(msg):
    sender = findPlayerBySid(gameState, request.sid)["name"]
    print(msg)
    socketIo.emit("chat", json.dumps({"sender": sender, "message": msg}), room="joined")
    return None


# -------------------------------------------------------------------------


def playCard(gameState, card, player):
    sender = next(p for p in gameState["players"] if p["sid"] == player)

    if sender["turn"] != True:
        print("It's not your turn. Stop hacking.")
        return gameState

    if card not in playable(sender["hand"], gameState["table"]):
        print("Illegal move. Stop hacking.")
        return gameState

    nPlayers = len(gameState["players"])
    playerIndex = next(i for i,p in enumerate(gameState["players"]) if p["turn"] == True)

    # transfer played card from hand to table
    gameState["table"].append(card)
    gameState["players"][playerIndex]["hand"].remove(card)

    # transfer turn to next player
    gameState["players"][playerIndex]["turn"] = False
    gameState["players"][(playerIndex + 1) % nPlayers]["turn"] = True

    if len(gameState["table"]) < nPlayers:
        # round is not over
        return gameState
    
    # round is over, transfer table to round winner
    takesIndex = takes(gameState["table"])
    takesPlayer = ((playerIndex - (nPlayers - 1)) % nPlayers + takesIndex) % nPlayers
    gameState["players"][takesPlayer]["cardsWon"] += gameState["table"]

    msg = str(gameState["players"][takesPlayer]["name"]) + " takes -- " + gameState["table"][takesIndex] + " takes " + str(gameState["table"])
    socketIo.emit("INFO", msg, room="joined")
    print(msg)

    if all(len(p["hand"]) == 0 for p in gameState["players"]):
        # players have no cards, game ends
        # check for pagat ultimo
        pagatIndex = pagatUltimo(gameState["table"])
        if pagatIndex > -1:
            pagatPlayer = (pagatIndex + pagatIndex) % nPlayers
            gameState["players"][pagatPlayer]["contractBonus"] += [{"bonus": "pagatUltimo", "value": 25}]
            print("PAGAT ULTIMO: ", gameState["players"][pagatPlayer]["name"])

    # player who takes begins next round
    gameState["players"][(playerIndex + 1) % nPlayers]["turn"] = False
    gameState["players"][takesPlayer]["turn"] = True
    gameState["table"] = []
    return gameState


def broadcastResults(res):
    socketIo.emit("gameOver", res, room="joined")
    return None



@socketIo.on("playCard")
def handlePlayCard(card):
    global gameState
    gameState = playCard(gameState, card, request.sid)
    dispatchPublicState("getState", gameState)

    if all(len(p["hand"]) == 0 for p in gameState["players"]):
        results =  concludeGame(gameState)
        broadcastResults(results)
    return None



@socketIo.on("getState")
def handleGetCards():
    global gameState
    playerState = getPublicState(gameState, request.sid)
    socketIo.emit("getState", json.dumps(playerState), room=request.sid)
    return None



def dispatchPublicState(event, gameState):
    for player in gameState["players"]:
        playerState = getPublicState(gameState, player["sid"])
        socketIo.emit(event, json.dumps(playerState), room=player["sid"])
    return None



def findPlayerBySid(gameState, sid):
    return next(p for p in gameState["players"] if p["sid"] == sid)





def getPublicState(gameState, sid):
    playerIndex = next(i for i,v in enumerate(gameState["players"]) if v["sid"] == sid)
    player = gameState["players"][playerIndex]
    #player = findPlayerBySid(gameState, sid)
    
    _playable = []
    if player["turn"] == True and gameState["phase"] == "active":
        _playable = playable(player["hand"], gameState["table"])
    
    _state =  {
        "phase": gameState["phase"],
        "myIndex": playerIndex,
        "table": gameState["table"],
        "players": [{
            "name": p["name"],
            "contracts": p["contracts"]
        } for p in gameState["players"]],
        "hand": player["hand"],
        "playable": _playable,
        "cardsWon": player["cardsWon"],
        "turn": player["turn"]
    }

    if gameState["phase"] == "contracts":
        _state["playableContracts"] = playableContracts(gameState) + ["naprej"]

    return _state




# ------------ LOBBY ------------------------------------------------------

def dispatchLobbyState(connected):
    msg = [[u["name"], u["ready"], False] for u in connected]
    for i in range(0, len(connected)):
        msg[i][2] = True
        socketIo.emit("getUsers", msg, room=connected[i]["sid"])
        msg[i][2] = False



def startGame(connected):
    (talon, hands) = dealCards(deck, connected)
    for i in range(0, len(connected)):
        socketIo.emit("getCards", hands[i], room=connected[i]["sid"])



@socketIo.on("join")
def handleJoin(msg):
    # TODO: if sid not in connected
    connected.append({"name": msg, 
                      "sid": request.sid,
                      "ready": False})
    dispatchLobbyState(connected)
    join_room("joined")
    return None



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
    return None



@socketIo.on("disconnect")
def handleLeave():
    global connected
    connected = [u for u in connected if u["sid"] != request.sid]
    dispatchLobbyState(connected)
    leave_room("joined")
    return None


if __name__ == '__main__':
    socketIo.run(app, host='0.0.0.0', port=5000)


