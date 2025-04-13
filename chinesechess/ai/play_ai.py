# play_ai.py
# Dùng model đã huấn luyện để chọn nước đi tốt nhất từ trạng thái bàn cờ

import torch
from chinesechess.ai.xiangqi_net import XiangqiNet
from chinesechess.ai.utils import encode_board
import numpy as np
import random

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = "chinesechess/model_trained.pth"

# === Tải model ===
def load_model():
    model = XiangqiNet().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model

# === Chuyển move index về dạng (x1, y1, x2, y2) ===
def index_to_move(index):
    from_idx = index // 90
    to_idx = index % 90
    x1, y1 = from_idx // 9, from_idx % 9
    x2, y2 = to_idx // 9, to_idx % 9
    return (x1, y1, x2, y2)

# === Hàm chọn nước đi tốt nhất ===
def select_best_move(model, board, current_player, valid_moves):
    board_tensor = encode_board(board, current_player).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        policy_logits, value = model(board_tensor)
        probs = torch.softmax(policy_logits, dim=1).cpu().numpy().flatten()

    # Lọc ra các move hợp lệ
    move_scores = []
    for move in valid_moves:
        x1, y1, x2, y2 = move
        from_idx = x1 * 9 + y1
        to_idx = x2 * 9 + y2
        idx = from_idx * 90 + to_idx
        move_scores.append((probs[idx], move))

    # Sắp xếp theo xác suất giảm dần
    move_scores.sort(reverse=True, key=lambda x: x[0])

    best_score, best_move = move_scores[0]
    return best_move, best_score

# === Demo sử dụng ===
def main():
    model = load_model()

    # Demo bàn cờ ban đầu
    board = [
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
    current_player = 'r'

    # Giả lập 10 nước đi ngẫu nhiên hợp lệ
    valid_moves = [(random.randint(0, 9), random.randint(0, 8), random.randint(0, 9), random.randint(0, 8)) for _ in range(10)]

    move, score = select_best_move(model, board, current_player, valid_moves)
    print(f"🤖 AI chọn nước đi: {move} với xác suất {score:.4f}")

if __name__ == '__main__':
    main()
