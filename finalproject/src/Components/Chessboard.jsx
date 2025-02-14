import React, { useState } from "react";

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
  ["R", "N", "B", "A", "K", "A", "B", "N", "R"]
];

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
  P: "./Assets/black-pawn.png"
};

const Chessboard = () => {
  const [board, setBoard] = useState(initialBoard);

  return (
    <div className="relative w-96 h-[400px] bg-green-700 border border-gray-700 p-2">
      {/* Vẽ lưới cờ tướng */}
      <div className="absolute w-full h-full grid grid-cols-8 grid-rows-9 gap-0.5">
        {[...Array(9)].map((_, row) =>
          [...Array(8)].map((_, col) => (
            <div
              key={`${row}-${col}`}
              className="border border-gray-500 w-full h-full"
            />
          ))
        )}
      </div>
      {/* Hiển thị quân cờ trên các nút giao nhau */}
      <div className="absolute w-full h-full">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            piece && (
              <img
                key={`${rowIndex}-${colIndex}`}
                src={pieceImages[piece]}
                alt={piece}
                className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-black"
                style={{
                  left: `${(colIndex / 8) * 100}%`,
                  top: `${(rowIndex / 9) * 100}%`
                }}
              />
            )
          ))
        )}
      </div>
    </div>
  );
};

export default Chessboard;


