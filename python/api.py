from main import *

from flask import Flask,jsonify,request
app = Flask(__name__)
@app.route('/',methods = ['get'])
def get_articles():
    return jsonify({"Title":"Python Voice Bot"})
@app.route('/post',methods = ['post'])
def add_articles():
    i=1
    text=request.json['question'] 
    ans = response(text)
    return jsonify({"answer":ans})
if __name__ == "__main__":
    app.run()
