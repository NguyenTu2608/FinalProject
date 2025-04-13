from flask import Flask, request, jsonify
from chinesechess.ai.play_ai import load_model, select_best_move
import json

app = Flask(__name__)
model = load_model()

@app.route("/api/move", methods=["POST"])
def get_ai_move():
    data = request.json
    board = data.get("board")  # bàn cờ dạng 10x9 string
    player = data.get("player")  # 'r' hoặc 'b'
    valid_moves = data.get("valid_moves")  # list [(x1, y1, x2, y2), ...]

    if not board or not valid_moves:
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    move, score = select_best_move(model, board, player, valid_moves)
    return jsonify({
        "move": move,
        "score": score
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
