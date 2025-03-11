import React, { useState } from "react";
import Chessboard from "./Game"; // Thành phần bàn cờ

const PracticeRoom = () => {
  const [currentPlayer, setCurrentPlayer] = useState("red"); // Người chơi hiện tại

  // Xử lý khi một người chơi di chuyển quân cờ
  const handleMove = () => {
    setCurrentPlayer((prev) => (prev === "red" ? "red" : "black"));
  };

  return (
    <div className="flex flex-col items-center">
      <Chessboard onMove={handleMove} currentPlayer={currentPlayer} />
    </div>
  );
};

export default PracticeRoom;
