import React from "react";
import "./Chessboard.css";

const pieces = {
  red: {
    soldiers: ["兵", "兵", "兵", "兵", "兵"],
    cannons: ["炮", "炮"],
    others: ["車", "馬", "相", "仕", "帥", "仕", "相", "馬", "車"],
  },
  black: {
    soldiers: ["卒", "卒", "卒", "卒", "卒"],
    cannons: ["砲", "砲"],
    others: ["車", "馬", "象", "士", "將", "士", "象", "馬", "車"],
  },
};

const Chesspieces = ({ color }) => {
  const isRed = color === "red";

  return (
    <div className={`chess-row ${isRed ? "red" : "black"}`}>
      {pieces[color].others.map((piece, index) => (
        <div key={index} className="piece">{piece}</div>
      ))}
      <div className="cannons">
        {pieces[color].cannons.map((piece, index) => (
          <div key={index} className="piece">{piece}</div>
        ))}
      </div>
      <div className="soldiers">
        {pieces[color].soldiers.map((piece, index) => (
          <div key={index} className="piece">{piece}</div>
        ))}
      </div>
    </div>
  );
};

export default Chesspieces;
