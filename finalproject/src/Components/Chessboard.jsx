import React, { useState } from "react";
import GameManager from "./GameManager";
// import TurnManager from "./TurnManager";x

// Ảnh quân cờ
const pieceImages = {
  r: "./Assets/red-rook.png",
  n: "./Assets/red-knight.png",
  b: "./Assets/red-bishop.png",
  a: "./Assets/red-advisor.png",
  k: "./Assets/red-king.png",
  c: "./Assets/red-cannon.png",
  p: "./Assets/red-pawn.png",
  R: "./Assets/black-rook.png",
  N: "./Assets/black-knight.png",
  B: "./Assets/black-bishop.png",
  A: "./Assets/black-advisor.png",
  K: "./Assets/black-king.png",
  C: "./Assets/black-cannon.png",
  P: "./Assets/black-pawn.png",
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
  // const [currentTurn, setCurrentTurn] = useState("red"); // Quản lý lượt chơi bằng state
  const gameManager = new GameManager(board);
  // const turnManager = new TurnManager();

  const handleClick = (row, col) => {
    const piece = board[row][col];

    // // Kiểm tra lượt chơi
    // if (piece && !turnManager.isPlayerTurn(piece, currentTurn)) {
    //   console.log("Không phải lượt của bạn!");
    //   return;
    // }

    if (selectedPiece) {
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        // Di chuyển quân cờ
        const newBoard = gameManager.movePiece(selectedPiece.row, selectedPiece.col, row, col);
        setBoard(newBoard);
        setSelectedPiece(null);
        setValidMoves([]);
        // setCurrentTurn(turnManager.switchTurn(currentTurn)); // Cập nhật lượt chơi
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }

    } else if (piece) {
      // Chọn quân cờ và tính nước đi hợp lệ
      setSelectedPiece({ row, col, piece });
      setValidMoves(gameManager.getValidMoves(piece, row, col));
    }
  };
  const boardSize = 500;
  const cellSize = boardSize / 9;

  return (


    <div className="relative w-[500px] h-[550px] mx-auto">
      {/* <div className="text-center mb-2">
      Lượt hiện tại: {turnManager.current.getCurrentTurn() === "red" ? "Đỏ" : "Đen"}
    </div> */}
      <img src="./Assets/chessboard.png" alt="Chessboard" className="w-full h-full" />

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
          className="absolute w-[45px] h-[45px] bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${col * cellSize + cellSize / 2}px`,
            top: `${row * cellSize + cellSize / 2}px`,
          }}
          onClick={() => handleClick(row, col)}
        />
      ))}
    </div>
  );
};

export default Chessboard;
