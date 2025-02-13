import React from "react";

const initialBoard = [
  ["xe_den", "ma_den", "tuong_den", "si_den", "tướng_đen", "si_den", "tuong_den", "ma_den", "xe_den"],
  [null, null, null, null, null, null, null, null, null],
  [null, "phao_den", null, null, null, null, null, "phao_den", null],
  ["tot_den", null, "tot_den", null, "tot_den", null, "tot_den", null, "tot_den"],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  ["tot_do", null, "tot_do", null, "tot_do", null, "tot_do", null, "tot_do"],
  [null, "phao_do", null, null, null, null, null, "phao_do", null],
  [null, null, null, null, null, null, null, null, null],
  ["xe_do", "ma_do", "tuong_do", "si_do", "tướng_đỏ", "si_do", "tuong_do", "ma_do", "xe_do"],
];

export default function Chessboard() {
  const renderCell = (row, col, piece) => {
    const isSpecialRow = row === 4 || row === 5;
    const cellStyle = {
      width: "60px",
      height: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f0d9b5",
      border: "1px solid #8b4513",
      position: "relative",
    };

    if (isSpecialRow && (col === 3 || col === 5)) {
      cellStyle.backgroundColor = "#e8c888";
    }

    return (
      <div key={`${row}-${col}`} style={cellStyle}>
        {piece && (
          <img
            src={`/Assets/${piece}.png`}
            alt={piece}
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#c19a6b",
        borderRadius: "10px",
        border: "3px solid #5c3d2e",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 60px)",
          gridTemplateRows: "repeat(10, 60px)",
          gap: "0px",
        }}
      >
        {initialBoard.map((row, rowIndex) =>
          row.map((piece, colIndex) => renderCell(rowIndex, colIndex, piece))
        )}
      </div>
      <div
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#a83232",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        Sẵn sàng
      </div>
    </div>
  );
}
