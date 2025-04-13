# train.py
# Huấn luyện XiangqiNet từ dữ liệu self-play

import os
import json
import torch
import torch.nn as nn
import torch.optim as optim
from chinesechess.ai.utils import encode_board
from chinesechess.ai.xiangqi_net import XiangqiNet

SELFPLAY_DIR = "selfplay_data"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ==== Tạo target policy từ move ==== #
def move_to_index(move):
    x1, y1, x2, y2 = move
    return x1 * 9 + y1, x2 * 9 + y2  # from_idx, to_idx

def to_policy_vector(from_idx, to_idx):
    index = from_idx * 90 + to_idx  # 0 -> 8100
    vec = torch.zeros(8100)
    vec[index] = 1.0
    return vec

# ==== Load dữ liệu self-play ==== #
def load_training_data():
    inputs = []
    policy_targets = []
    value_targets = []

    for file in os.listdir(SELFPLAY_DIR):
        if not file.endswith(".json"): continue
        with open(os.path.join(SELFPLAY_DIR, file), 'r') as f:
            game = json.load(f)
            for entry in game:
                board = entry['board']
                player = entry['player']
                move = entry['move']
                result = entry['result']

                x = encode_board(board, current_player=player)
                from_idx, to_idx = move_to_index(move)
                policy = to_policy_vector(from_idx, to_idx)

                inputs.append(x)
                policy_targets.append(policy)
                value_targets.append(torch.tensor([result], dtype=torch.float32))

    return torch.stack(inputs), torch.stack(policy_targets), torch.stack(value_targets)

# ==== Huấn luyện mạng ====
def train():
    model = XiangqiNet().to(DEVICE)
    optimizer = optim.Adam(model.parameters(), lr=1e-4)
    loss_policy = nn.CrossEntropyLoss()
    loss_value = nn.MSELoss()

    print("🧠 Đang tải dữ liệu...")
    X, Y_policy, Y_value = load_training_data()
    print(f"✅ Đã tải {len(X)} mẫu dữ liệu")

    model.train()
    EPOCHS = 5
    BATCH_SIZE = 32

    for epoch in range(EPOCHS):
        total_loss = 0
        for i in range(0, len(X), BATCH_SIZE):
            x_batch = X[i:i+BATCH_SIZE].to(DEVICE)
            y_policy = Y_policy[i:i+BATCH_SIZE].to(DEVICE)
            y_value = Y_value[i:i+BATCH_SIZE].to(DEVICE)

            optimizer.zero_grad()
            pred_policy, pred_value = model(x_batch)

            loss_p = loss_policy(pred_policy, torch.argmax(y_policy, dim=1))
            loss_v = loss_value(pred_value.squeeze(), y_value.squeeze())
            loss = loss_p + loss_v
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        print(f"✅ Epoch {epoch+1} | Loss: {total_loss:.4f}")

    # Lưu model
    torch.save(model.state_dict(), "chinesechess/model_trained.pth")
    print("✅ Đã lưu model tại chinesechess/model_trained.pth")

if __name__ == '__main__':
    train()