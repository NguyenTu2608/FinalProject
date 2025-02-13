import React from "react";
import Chessboard from "../../Components/Chessboard";

export default function Game() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#3e2723",
      }}
    >
      <h1 style={{ color: "white", marginBottom: "20px" }}>Bàn Cờ Tướng</h1>
      <Chessboard />
    </div>
  );
}
