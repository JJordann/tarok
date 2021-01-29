from flask import Flask, request
from flask_socketio import SocketIO, send
import json
import random

app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'

socketIo = SocketIO(app, cors_allowed_origins="*")

deck = [
    'srce_kralj',
    'srce_kraljica',
    'srce_konj',
    'srce_poba',
    'srce_1',
    'srce_2',
    'srce_3',
    'srce_4',

    'kara_kralj',
    'kara_kraljica',
    'kara_konj',
    'kara_poba',
    'kara_1',
    'kara_2',
    'kara_3',
    'kara_4',

    'pik_kralj',
    'pik_kraljica',
    'pik_konj',
    'pik_poba',
    'pik_10',
    'pik_9',
    'pik_8',
    'pik_7',

    'kriz_kralj',
    'kriz_kraljica',
    'kriz_konj',
    'kriz_poba',
    'kriz_10',
    'kriz_9',
    'kriz_8',
    'kriz_7',

    'tarok_1',
    'tarok_2',
    'tarok_3',
    'tarok_4',
    'tarok_5',
    'tarok_6',
    'tarok_7',
    'tarok_8',
    'tarok_9',
    'tarok_10',
    'tarok_11',
    'tarok_12',
    'tarok_13',
    'tarok_14',
    'tarok_15',
    'tarok_16',
    'tarok_17',
    'tarok_18',
    'tarok_19',
    'tarok_20',
    'tarok_21',
    'tarok_22'
]


connected = []


def dealCards(deck, connected):
    random.shuffle(deck)
    talon = deck[0:6]
    nPlayers = len(connected)
    handSize = round(48 / nPlayers)
    hands = []
    for i in range(0, nPlayers):
        start = 6 + i * handSize
        end = start + handSize
        hands.append(deck[start:end])

    return (talon, hands)

#(talon, hands) = dealCards(deck, [1, 2, 3, 4])

#print("TALON: " + str(talon) + "\n")
#print("HANDS: \n")
#for h in hands:
    #print(str(h) + "\n")



@socketIo.on('message')
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)


@socketIo.on("connect")
def handleConnect():
    print("++++ CONNECTED ++++")
    print("SID: " + request.sid)
    print(connected)


def allPlayerNames(connected):
    return [c["name"] for c in connected]


@socketIo.on("join", namespace="/joined")
def handleJoin(msg):
    print("JOIN: #### " + msg + " ####" + request.sid + "####")
    connected.append({"name": msg, 
                      "sid": request.sid,
                      "ready": False})
    socketIo.emit("join", allPlayerNames(connected), namespace="/joined", broadcast=True)   
    print(connected)

@socketIo.on("ready", namespace="/joined")
def handleReady(msg):
    global connected
    for u in connected:
        if u["sid"] == request.sid:
            u["ready"] = True
            print(connected)
            print("ALL READY: " + str(allReady(connected)))
            return None
    

def allReady(connected):
    return all(map(lambda x: x["ready"], connected))



@socketIo.on("disconnect", namespace="/joined")
def handleLeave():
    print(request.sid + " left")
    global connected
    connected = [u for u in connected if u["sid"] != request.sid]
    socketIo.emit("join", allPlayerNames(connected), namespace="/joined", broadcast=True)   
    print(connected)


@socketIo.on("disconnect")
def handleDisconnect():
    print(" ---- DISCONNECTED ----")
    print("SID" + request.sid)


if __name__ == '__main__':
    socketIo.run(app)