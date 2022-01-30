# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, request, jsonify, make_response

from werkzeug.serving import WSGIRequestHandler
app = Flask(__name__)


@app.route("/message", methods=["POST"])
def message():
    req = request.get_json(force=True, silent=True)
    sendee = req['sendee']
    message = req['message']
    from twilio.rest import Client


    account_sid = "YOUR ACCOUNT SID"
    auth_token = "YOUR AUTH TOKEN"
    client = Client(account_sid, auth_token)
    try:
        message = client.messages.create(
        from_="whatsapp:+14155238886",
        body=message,
        to="whatsapp:{}".format(sendee),
    )
        print(message.sid)
        return "Message sent"
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': str(e)}), 400)
    


@app.route("/")
def hello_world():
    return "Hello World"


if __name__ == "__main__":
    WSGIRequestHandler.protocol_version = "HTTP/1.1"
    app.run()
