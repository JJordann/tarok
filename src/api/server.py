from flask import Flask
from flask_socketio import SocketIO, send
import json


app = Flask(__name__)
app.config['SECRET_KEY'] = 'sekret'

socketIo = SocketIO(app, cors_allowed_origins="*")


@socketIo.on('message')
def handleMessage(msg):
    print(msg)
    send(msg, broadcast=True)

@socketIo.on("connect")
def handleConnect():
    print("---- CONNECTED ----")


if __name__ == '__main__':
    socketIo.run(app)

#@app.route('/api/first', methods=['GET'])
#def hello_world():
    #return json.dumps({"first": "borut", "last": "zoran"})