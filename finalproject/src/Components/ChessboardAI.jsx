import React, { useState } from "react";
import GameManager from "./GameManager";

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

const ChessboardAI = () => {
  const [board, setBoard] = useState(initialBoard);
  const gameManager = new GameManager(board);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const boardSize = 500; // Thay đổi kích thước bàn cờ
  const cellSize = boardSize / 9;

  const handleClick = async (row, col) => {
    const piece = board[row][col]; // Lấy quân cờ tại vị trí (row, col)
    
    if (piece && typeof piece === "string") {
      // Đảm bảo rằng piece là một chuỗi
      const pieceLower = piece.toLowerCase(); // Chuyển thành chữ thường nếu là chuỗi
      if (selectedPiece) {
        // Di chuyển quân cờ nếu đã có quân cờ được chọn
        const newBoard = [...board];
        newBoard[row][col] = selectedPiece.piece;
        newBoard[selectedPiece.row][selectedPiece.col] = "";
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);
      } else {
        setSelectedPiece({ row, col, piece });
        setValidMoves(gameManager.getValidMoves(row, col)); // Tìm các nước đi hợp lệ
      }
    } else {
      console.log("Không có quân cờ tại vị trí này hoặc không phải là chuỗi.");
    }
  };
  
  
  

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

      {errorMessage && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ChessboardAI;
