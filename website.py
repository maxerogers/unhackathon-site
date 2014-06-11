from flask import Flask, url_for, request
from flask import render_template, redirect
import config
import sqlite3
import os

app = Flask(__name__)

app.config.from_object('config')

db_file = os.path.join(os.path.dirname(os.path.realpath(__file__)), "data.db")

def static_url(path):
    if app.debug:
        return url_for("static", filename=path)
    else:
        return "http://{0}/static/{1}?v={2}".format(app.config["CDN_DOMAIN"], path, app.config["CDN_VERSION"])

app.jinja_env.globals["static_url"] = static_url

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/info")
def info():
    if "type" not in request.args:
        redirect(url_for("index"))
    return render_template("info.html", type=request.args["type"])

@app.route("/submit", methods=["POST"])
def submit():
    with sqlite3.connect(db_file) as conn:
        ideas = request.form.get("ideas", False) == "on"
        args = (request.form["type"], request.form["email"], ideas)
        conn.execute("INSERT INTO entries (type, email, ideas) VALUES (?, ?, ?)", args)
        conn.commit()
    return redirect(url_for("done"))

@app.route("/done")
def done():
    return render_template("done.html")


if __name__ == "__main__":
    app.debug = True
    app.run()