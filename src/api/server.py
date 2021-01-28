from flask import Flask
import json


app = Flask(__name__)

@app.route('/api/first', methods=['GET'])
def hello_world():
    return json.dumps({"first": "borut", "last": "zoran"})