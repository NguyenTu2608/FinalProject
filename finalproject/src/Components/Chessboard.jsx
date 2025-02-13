import React from "react";
import "./Chessboard.css";

const Chessboard = () => {
  // Danh sách quân cờ với vị trí (cột, hàng)
  const initialPieces = [
    { type: "車", position: [1, 1] },
    { type: "馬", position: [2, 1] },
    { type: "象", position: [3, 1] },
    { type: "士", position: [4, 1] },
    { type: "帥", position: [5, 1] },
    { type: "士", position: [6, 1] },
    { type: "象", position: [7, 1] },
    { type: "馬", position: [8, 1] },
    { type: "車", position: [9, 1] },
    { type: "炮", position: [2, 3] },
    { type: "炮", position: [8, 3] },
    { type: "兵", position: [1, 4] },
    { type: "兵", position: [3, 4] },
    { type: "兵", position: [5, 4] },
    { type: "兵", position: [7, 4] },
    { type: "兵", position: [9, 4] },
    // Quân đối thủ
    { type: "卒", position: [1, 7] },
    { type: "卒", position: [3, 7] },
    { type: "卒", position: [5, 7] },
    { type: "卒", position: [7, 7] },
    { type: "卒", position: [9, 7] },
    { type: "炮", position: [2, 8] },
    { type: "炮", position: [8, 8] },
    { type: "車", position: [1, 10] },
    { type: "馬", position: [2, 10] },
    { type: "象", position: [3, 10] },
    { type: "士", position: [4, 10] },
    { type: "將", position: [5, 10] },
    { type: "士", position: [6, 10] },
    { type: "象", position: [7, 10] },
    { type: "馬", position: [8, 10] },
    { type: "車", position: [9, 10] },
  ];

  // Render quân cờ tại đúng nút giao
  const renderPieces = () => {
    return initialPieces.map((piece, index) => {
      const [col, row] = piece.position;
      return (
        <div
          key={index}
          className="chess-piece"
          style={{
            left: `${(col - 1) * 50}px`,
            top: `${(row - 1) * 50}px`,
          }}
        >
          {piece.type}
        </div>
      );
    });
  };

  return (
    <div className="chessboard">
      {/* Các ô vuông */}
      <div className="grid">
        {Array.from({ length: 90 }).map((_, index) => (
          <div key={index} className="grid-cell"></div>
        ))}
      </div>

      {/* Các quân cờ */}
      {renderPieces()}
    </div>
  );
};

export default Chessboard;
