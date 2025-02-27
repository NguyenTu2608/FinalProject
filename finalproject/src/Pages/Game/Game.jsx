import React from "react";
import Chessboard from "../../Components/Chessboard";

export default function Game() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('../public/Assets/background.png')" }}>
      <Chessboard />
    </div>
  );
}
