from flask import Flask
from flask_cors import CORS, cross_origin
import json


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/api/first', methods=['GET'])
@cross_origin()
def hello_world():
    return json.dumps({"first": "borut", "last": "zoran"})