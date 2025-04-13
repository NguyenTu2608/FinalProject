# selfplay.py
# AI tự chơi cờ tướng với chính mình để tạo dữ liệu huấn luyện

import torch

from chinesechess.ai.utils import encode_board
from chinesechess.ai.xiangqi_net import XiangqiNet
import random
import os
import json

# === Placeholder cho logic bàn cờ ===
# Bạn cần thay thế bằng class GameManager hoặc XiangqiEnv thực tế
class DummyGame:
    def __init__(self):
        self.board = self.get_initial_board()
        self.current_player = 'r'
        self.done = False
        self.result = None

    def get_initial_board(self):
        return [
            ["r", "n", "b", "a", "k", "a", "b", "n", "r"],
            ["", "", "", "", "", "", "", "", ""],
            ["", "c", "", "", "", "", "", "c", ""],
            ["p", "", "p", "", "p", "", "p", "", "p"],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["P", "", "P", "", "P", "", "P", "", "P"],
            ["", "C", "", "", "", "", "", "C", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["R", "N", "B", "A", "K", "A", "B", "N", "R"]
        ]

    def get_valid_moves(self):
        # Giả sử random 10 nước đi ngẫu nhiên
        return [(random.randint(0, 9), random.randint(0, 8), random.randint(0, 9), random.randint(0, 8)) for _ in range(10)]

    def apply_move(self, move):
        # Không cần logic thật ở bước này, chỉ là mô phỏng
        self.current_player = 'b' if self.current_player == 'r' else 'r'
        if random.random() < 0.01:
            self.done = True
            self.result = random.choice([-1, 0, 1])

    def is_done(self):
        return self.done

    def get_result(self):
        return self.result

    def get_board(self):
        return self.board

    def get_current_player(self):
        return self.current_player


def self_play_one_game(model):
    game = DummyGame()
    memory = []

    while not game.is_done():
        board_tensor = encode_board(game.get_board(), game.get_current_player()).unsqueeze(0)  # [1, 29, 10, 9]
        policy_logits, _ = model(board_tensor)

        # Chọn nước đi ngẫu nhiên theo policy (placeholder)
        valid_moves = game.get_valid_moves()
        move = random.choice(valid_moves)

        memory.append({
            'board': game.get_board(),
            'player': game.get_current_player(),
            'move': move
        })

        game.apply_move(move)

    result = game.get_result()
    for entry in memory:
        entry['result'] = result

    return memory


def save_game_data(game_data, folder="selfplay_data"):
    os.makedirs(folder, exist_ok=True)
    idx = len(os.listdir(folder))
    with open(os.path.join(folder, f"game_{idx}.json"), "w") as f:
        json.dump(game_data, f)


def main():
    model = XiangqiNet()
    model.eval()

    for i in range(5):  # Tự chơi 5 ván làm mẫu
        data = self_play_one_game(model)
        save_game_data(data)
        print(f"✅ Đã lưu game {i+1} với {len(data)} lượt đi")


if __name__ == "__main__":
    main()
