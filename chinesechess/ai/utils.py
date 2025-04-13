import numpy as np
import torch

# Chuẩn hóa quân cờ từ ký hiệu 1 chữ cái về định dạng "rC", "bN" v.v
def convert_symbol(symbol):
    if symbol == "":
        return "."
    
    piece_map = {
        'r': 'C', 'n': 'H', 'b': 'E', 'a': 'A', 'k': 'K', 'p': 'P', 'c': 'N',
        'R': 'C', 'N': 'H', 'B': 'E', 'A': 'A', 'K': 'K', 'P': 'P', 'C': 'N'
    }

    if symbol.islower():
        return "b" + piece_map[symbol]
    else:
        return "r" + piece_map[symbol]

# Danh sách quân cờ 14 loại
PIECE_TYPES = [
    'rK', 'rA', 'rE', 'rH', 'rC', 'rN', 'rP',
    'bK', 'bA', 'bE', 'bH', 'bC', 'bN', 'bP'
]

PIECE_TO_INDEX = {piece: idx for idx, piece in enumerate(PIECE_TYPES)}

def encode_board(board, current_player='r'):
    """
    Encode bàn cờ từ React (10x9 string) thành tensor [29, 10, 9]
    """
    planes = np.zeros((29, 10, 9), dtype=np.float32)

    for i in range(10):
        for j in range(9):
            piece = convert_symbol(board[i][j])
            if piece in PIECE_TO_INDEX:
                idx = PIECE_TO_INDEX[piece]
                planes[idx, i, j] = 1.0

    # Plane 28: player indicator
    if current_player == 'r':
        planes[28, :, :] = 1.0

    return torch.tensor(planes)
