from flask import Flask, jsonify, send_from_directory, request
import random

app = Flask(__name__, static_folder='.')

history = [1.0, 1.5]
MAX_HISTORY = 10

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/predict/<mode>')
def predict(mode):
    last_input = request.args.get('last', type=float)

    if last_input is not None:
        history.append(last_input)
        if len(history) > MAX_HISTORY:
            history.pop(0)

    if mode == 'rng':
        chance = random.random()
        prediction = round(random.uniform(1.0, 3.0), 2) if chance <= 0.8 else round(random.uniform(3.1, 50.0), 2)

    elif mode == 'fibonacci':
        if len(history) >= 2:
            prediction = round(history[-1] + history[-2], 2)
        else:
            prediction = round(random.uniform(1.0, 3.0), 2)

    elif mode == 'average':
        data = history[-3:] if len(history) >= 3 else history
        prediction = round(sum(data) / len(data), 2)

    elif mode == 'smart':
        if len(history) >= 2:
            x1, x2 = history[-2], history[-1]
            a = 1.15
            b = 0.1
            prediction = round(a * x2 - 0.5 * x1 + b, 2)
        else:
            prediction = round(random.uniform(1.0, 3.0), 2)

    else:
        prediction = round(random.uniform(1.0, 3.0), 2)

    history.append(prediction)
    if len(history) > MAX_HISTORY:
        history.pop(0)

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)
