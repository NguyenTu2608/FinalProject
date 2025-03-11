import React, { useState } from "react";
import GameManager from "./GameManager";

// Ảnh quân cờ
const pieceImages = {
  r: "/Assets/red-rook.png",
  n: "/Assets/red-knight.png",
  b: "/Assets/red-bishop.png",
  a: "/Assets/red-advisor.png",
  k: "/Assets/red-king.png",
  c: "/Assets/red-cannon.png",
  p: "/Assets/red-pawn.png",
  R: "/Assets/black-rook.png",
  N: "/Assets/black-knight.png",
  B: "/Assets/black-bishop.png",
  A: "/Assets/black-advisor.png",
  K: "/Assets/black-king.png",
  C: "/Assets/black-cannon.png",
  P: "/Assets/black-pawn.png",
};

// Bàn cờ khởi tạo
const initialBoard = [
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
];

const Chessboard = () => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const gameManager = new GameManager(board); 
  const [currentPlayer, setCurrentPlayer] = useState("black"); // 'red' hoặc 'black'
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  

  const handleClick = (row, col) => {
    const piece = board[row][col];
    const isRedPiece = piece && piece === piece.toLowerCase(); // Quân đỏ là chữ thường
    const isBlackPiece = piece && piece === piece.toUpperCase(); // Quân đen là chữ hoa
    if (selectedPiece) {
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        if (gameManager.isMoveCausingCheck(selectedPiece.row, selectedPiece.col, row, col, currentPlayer === "red")) {
          setErrorMessage("Nước đi này sẽ gây chiếu tướng!");
          return; // Không thực hiện nước đi
        }

        // Move the piece
        const newBoard = gameManager.movePiece(
          selectedPiece.row,
          selectedPiece.col,
          row,
          col
        );

        setBoard([...newBoard]); // Ensure a new state reference
        setSelectedPiece(null);
        setValidMoves([]);
        setErrorMessage("");

        

        // Kiểm tra xem Tướng của đối phương có bị chiếu hay không
        const opponentIsRed = currentPlayer === "black";
        if (gameManager.isKingInCheck(opponentIsRed)) {
          setErrorMessage("Chiếu tướng!");
        }
        setCurrentPlayer(currentPlayer === "red" ? "black" : "red"); // Xóa thông báo lỗi
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
        // setErrorMessage("Nước đi không hợp lệ!");
      }
    } else if (piece)
      if ((currentPlayer === "red" && isRedPiece) || (currentPlayer === "black" && isBlackPiece)) {

        const valid = gameManager.getValidMoves(piece, row, col);
        setSelectedPiece({ row, col, piece });
        setValidMoves(valid);
        setErrorMessage(""); // Xóa thông báo lỗi
      }
      else {
        // setErrorMessage("Không phải lượt của bạn!");
      }
  };
  

  const boardSize = 500;
  const cellSize = boardSize / 9;

  return (
    <div className="relative w-[500px] h-[550px] mx-auto">
      <img src="/Assets/chessboard.png" alt="Chessboard" className="w-full h-full" />

      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) =>
          piece ? (
            <img
              key={`${rowIndex}-${colIndex}`}
              src={pieceImages[piece]}
              alt={piece}
              className="absolute w-[45px] h-[45px] transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${colIndex * cellSize + cellSize / 2}px`,
                top: `${rowIndex * cellSize + cellSize / 2}px`,
              }}
              onClick={() => handleClick(rowIndex, colIndex)}
            />
          ) : null
        )
      )}

      {validMoves.map(([row, col]) => (
        <div
          key={`${row}-${col}`}
          className="absolute w-[45px] h-[45px] bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${col * cellSize + cellSize / 2}px`,
            top: `${row * cellSize + cellSize / 2}px`,
          }}
          onClick={() => handleClick(row, col)}
        />
      ))}
      {/* Hiển thị thông báo lỗi */}
      {errorMessage && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
          {errorMessage}
        </div>
      )}

      {/* Hiển thị lượt hiện tại trên bàn cờ */}
      {/* <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded">
        Lượt hiện tại: {currentPlayer === "red" ? "Đỏ" : "Đen"}
      </div> */}

    </div>
  );

  
};

export default Chessboard;
