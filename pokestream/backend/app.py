from flask import Flask, render_template, send_from_directory, jsonify, request
import json

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/episodes")
def get_episodes():
    with open("backend/episodes.json") as f:
        data = json.load(f)
    
    lang = request.args.get('lang', 'en')
    season_num = request.args.get('season', None)
    
    filtered = []
    for season in data:
        if season_num and str(season['season']) != str(season_num):
            continue
        filtered_eps = [ep for ep in season['episodes'] if ep['language'] == lang]
        if filtered_eps:
            filtered.append({
                "season": season['season'],
                "title": season['title'],
                "episodes": filtered_eps
            })
    return jsonify(filtered)

@app.route("/video/<filename>")
def stream_video(filename):
    return send_from_directory("static/videos", filename)

if __name__ == "__main__":
    app.run(debug=True)
