from flask import Flask, request
from flask_socketio import SocketIO, send
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'

socketIo = SocketIO(app, cors_allowed_origins="*")

connected = []

@socketIo.on('message')
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)


@socketIo.on("connect")
def handleConnect():
    print("++++ CONNECTED ++++")
    print("SID: " + request.sid)
    print(connected)


@socketIo.on("join", namespace="/joined")
def handleJoin(msg):
    print("JOIN: #### " + msg + " ####" + request.sid + "####")
    connected.append({"name": msg, 
                      "sid": request.sid,
                      "ready": False})
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
    print(connected)


@socketIo.on("disconnect")
def handleDisconnect():
    print(" ---- DISCONNECTED ----")
    print("SID" + request.sid)


if __name__ == '__main__':
    socketIo.run(app)