from flask import Flask, request, jsonify
from flask_cors import CORS
from main import TripCrew

app = Flask(__name__)
CORS(app)

@app.route('/')

def hello():
    return 'Hello, World!'

@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    data = request.get_json()
    print(data)
    tripCrew = TripCrew(**data)
    result = tripCrew.run()
    return jsonify({'result': result})
if __name__ == '__main__':
    app.run(debug=True)