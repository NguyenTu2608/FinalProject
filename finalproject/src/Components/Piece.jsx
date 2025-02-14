import React from "react";
import "./Chessboard.css";

const Piece = ({ type, x, y, color }) => {
  return (
    <div className={`piece ${color}`} style={{ left: `${x * 50}px`, top: `${y * 50}px` }}>
      {type}
    </div>
  );
};

export default Piece;
