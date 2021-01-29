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
    connected.append({"name": msg, "sid": request.sid})
    print(connected)


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