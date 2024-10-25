from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Global data variable
data = []

@app.route('/')
def home():
    return render_template('earth.html')

@app.route('/points')
def points():
    return jsonify(data)

def render(coord):
    global data
    data = coord
    if __name__ == '__main__':
        app.run(debug=True)