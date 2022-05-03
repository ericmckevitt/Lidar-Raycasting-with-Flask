from flask import render_template, request
from flask import Flask

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():

    if request.method == 'POST':
        request.files['file'].save("static/file.txt")
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
