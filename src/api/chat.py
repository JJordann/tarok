from __main__ import sio
from flask import request
import json



def sendChat(self, msg):
    sender = next(p for p in self.players if p["sid"] == request.sid)["name"]
    print(sender,"> ", msg)
    sio.emit("chat", json.dumps({"sender": sender, "message": msg}), room=self.room)