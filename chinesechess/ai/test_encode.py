from utils import encode_board

initialBoard = [
    ["r", "n", "b", "a", "k", "a", "b", "n", "r"],
    ["", "", "", "", "", "", "", "", ""],
    ["", "c", "", "", "", "", "", "c", ""],
    ["p", "", "p", "", "p", "", "p", "", "p"],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["P", "", "P", "", "P", "", "P", "", "P"],
    ["", "C", "", "", "", "", "", "C", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["R", "N", "B", "A", "K", "A", "B", "N", "R"],
]

# Gọi hàm encode_board để chuyển thành tensor
tensor = encode_board(initialBoard, current_player='r')

# In ra thông tin tensor
print("Kích thước tensor:", tensor.shape)
print("Kiểu dữ liệu:", tensor.dtype)
print("Giá trị tại plane 0 (rK):")
print(tensor[0])
