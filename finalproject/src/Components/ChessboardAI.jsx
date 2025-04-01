import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const mode = queryParams.get("mode") || "easy";
  const playerColor = queryParams.get("color") || "black";
  const aiColor = playerColor === "black" ? "red" : "black";

  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTurn, setCurrentTurn] = useState("black"); // Đen đi trước

  const gameManager = new GameManager(board);

  // Nếu AI là Đen, nó sẽ đi trước khi game bắt đầu
  useEffect(() => {
    if (currentTurn === aiColor) {
      handleAIMove();
    }
  }, [currentTurn]);

    let aiDifficulty = "";

    const handleAIMove = () => {
        switch(aiDifficulty) {
            case "easy":
                handleAIMoveEasy();
                break;
            case "medium":
                handleAIMoveMedium();
                break;
            case "hard":
                handleAIMoveHard();
                break;
            default:
                handleAIMoveEasy();
        }
    };


  // Xử lý nước đi của AI (chọn ngẫu nhiên từ danh sách nước hợp lệ)
  const handleAIMoveEasy = () => {
    if (currentTurn !== aiColor) return; // Chỉ chạy khi đến lượt AI
    console.log("🤖 AI đang tính toán nước đi...");

    let possibleMoves = [];
    let captureMoves = []; // Lưu các nước có thể ăn quân
    let centerMoves = [];  // Lưu các nước giúp AI kiểm soát bàn cờ

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = board[row][col];
            if (piece && ((aiColor === "black" && piece === piece.toUpperCase()) || 
                          (aiColor === "red" && piece === piece.toLowerCase()))) {
                const moves = gameManager.getValidMoves(piece, row, col);
                moves.forEach(([toRow, toCol]) => {
                    const targetPiece = board[toRow][toCol];

                    
                    if ((toRow >= 3 && toRow <= 6) && (toCol >= 3 && toCol <= 5)) {
                        centerMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    }
                    else if (targetPiece && targetPiece !== "") {
                        captureMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    }
                    // Nếu không thì đưa vào danh sách nước đi thông thường
                    else {
                        possibleMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    }
                });
            }
        }
    }

    let chosenMove = null;
    if (captureMoves.length > 0) {
        chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
        console.log("🤖 AI chọn nước đi ĂN QUÂN:", chosenMove);
    } else if (centerMoves.length > 0) {
        chosenMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
        console.log("🤖 AI chọn nước đi KIỂM SOÁT BÀN CỜ:", chosenMove);
    } else if (possibleMoves.length > 0) {
        chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        console.log("🤖 AI chọn nước đi THÔNG THƯỜNG:", chosenMove);
    }

    if (chosenMove) {
        const newBoard = gameManager.movePiece(chosenMove.fromRow, chosenMove.fromCol, chosenMove.toRow, chosenMove.toCol);
        if (!newBoard) {
            console.error("❌ Lỗi: movePiece trả về undefined!");
            return;
        }
        setBoard(newBoard);
        setCurrentTurn(playerColor); // Chuyển lượt về người chơi
    }
};
const handleAIMoveMedium = () => {
    // Chỉ thực hiện khi đến lượt AI
    if (currentTurn !== aiColor) return;

    console.log("🤖 AI (Medium) đang tính toán nước đi...");

    let possibleMoves = [];
    let captureMoves = [];
    let centerMoves = [];

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = board[row][col];
            if (piece && ((aiColor === "black" && piece === piece.toUpperCase()) || 
                          (aiColor === "red" && piece === piece.toLowerCase()))) {
                const moves = gameManager.getValidMoves(piece, row, col);
                moves.forEach(([toRow, toCol]) => {
                    const targetPiece = board[toRow][toCol];

                    // Nếu có thể ăn quân, ưu tiên nước này
                    if (targetPiece && targetPiece !== "") {
                        captureMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    }
                    // Nếu di chuyển về giữa bàn cờ (chiến thuật cơ bản)
                    else if ((toRow >= 3 && toRow <= 6) && (toCol >= 3 && toCol <= 5)) {
                        centerMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    } 
                    // Nếu không thì đưa vào danh sách nước đi thông thường
                    else {
                        possibleMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                    }
                });
            }
        }
    }

    // Ưu tiên các nước đi ăn quân đối thủ, sau đó là kiểm soát trung tâm
    let chosenMove = null;
    if (captureMoves.length > 0) {
        chosenMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    } else if (centerMoves.length > 0) {
        chosenMove = centerMoves[Math.floor(Math.random() * centerMoves.length)];
    } else if (possibleMoves.length > 0) {
        chosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }

    if (chosenMove) {
        const newBoard = gameManager.movePiece(chosenMove.fromRow, chosenMove.fromCol, chosenMove.toRow, chosenMove.toCol);
        setBoard(newBoard);
        setCurrentTurn(playerColor); // Đến lượt người chơi
    }
};
const handleAIMoveHard = () => {
    // Chỉ thực hiện khi đến lượt AI
    if (currentTurn !== aiColor) return;

    console.log("🤖 AI (Hard) đang tính toán nước đi...");

    let possibleMoves = [];
    let bestMove = null;
    let bestMoveScore = -Infinity;

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = board[row][col];
            if (piece && ((aiColor === "black" && piece === piece.toUpperCase()) || 
                          (aiColor === "red" && piece === piece.toLowerCase()))) {
                const moves = gameManager.getValidMoves(piece, row, col);
                moves.forEach(([toRow, toCol]) => {
                    const targetPiece = board[toRow][toCol];
                    const moveScore = evaluateMove(board, piece, row, col, toRow, toCol); // Hàm tính điểm nước đi

                    if (moveScore > bestMoveScore) {
                        bestMoveScore = moveScore;
                        bestMove = { fromRow: row, fromCol: col, toRow, toCol };
                    }
                });
            }
        }
    }

    if (bestMove) {
        const newBoard = gameManager.movePiece(bestMove.fromRow, bestMove.fromCol, bestMove.toRow, bestMove.toCol);
        setBoard(newBoard);
        setCurrentTurn(playerColor); // Đến lượt người chơi
    }
};

// Hàm tính điểm nước đi, có thể sử dụng các chiến lược như kiểm soát bàn cờ, bảo vệ quân cờ, ăn quân đối thủ, ...
const evaluateMove = (board, piece, fromRow, fromCol, toRow, toCol) => {
    // Ví dụ tính điểm dựa trên việc ăn quân và kiểm soát bàn cờ
    const targetPiece = board[toRow][toCol];
    let score = 0;

    if (targetPiece) {
        score += 10; // Giả sử ăn quân đối thủ có điểm cao
    }

    // Thêm các tiêu chí khác như kiểm soát khu vực giữa, bảo vệ quân, v.v.

    return score;
};


  // Xử lý khi người chơi chọn quân cờ hoặc di chuyển
  const handleClick = (row, col) => {
    console.log(`🎯 Clicked position: (${row}, ${col})`);
    console.log("📌 Quân cờ tại vị trí:", board?.[row]?.[col]);

    // 1️⃣ Kiểm tra vị trí có hợp lệ không
    if (row < 0 || row >= 10 || col < 0 || col >= 9) {
        console.warn(`⚠ Vị trí (${row}, ${col}) ngoài phạm vi bàn cờ!`);
        return;
    }
    if (!board || !board[row] || board[row][col] === undefined) {
        console.warn(`⚠ Dữ liệu quân cờ không hợp lệ tại (${row}, ${col})`);
        return;
    }
    if (currentTurn !== playerColor) return;

    const piece = board[row][col];

    // 2️⃣ Nếu chọn quân cờ hợp lệ (cùng màu với người chơi)
    if (piece && ((playerColor === "black" && piece === piece.toUpperCase()) || 
                  (playerColor === "red" && piece === piece.toLowerCase()))) {
        console.log("✅ Quân cờ hợp lệ:", piece);
        setSelectedPiece({ row, col });
        const validMoves = gameManager.getValidMoves(piece, row, col);
        setValidMoves(validMoves);
        console.log("📌 Nước đi hợp lệ:", validMoves);
        return;
    }

    // 3️⃣ Nếu đã chọn quân cờ và bấm vào vị trí hợp lệ
    if (selectedPiece) {
        const { row: fromRow, col: fromCol } = selectedPiece;
        console.log("🎯 Đang kiểm tra nước đi từ:", fromRow, fromCol, "đến", row, col);

        // Kiểm tra nước đi có hợp lệ không
        const isValidMove = validMoves.some(([r, c]) => r === row && c === col);
        console.log("📌 Move valid?", isValidMove);

        if (isValidMove) {
            // Thực hiện di chuyển
            const newBoard = gameManager.movePiece(fromRow, fromCol, row, col);
            if (!newBoard) {
                console.error("❌ Lỗi: movePiece trả về undefined!");
                return;
            }
            setBoard(newBoard);
            setSelectedPiece(null);
            setValidMoves([]);
            setCurrentTurn(aiColor); // Đến lượt AI

            setTimeout(() => handleAIMove(), 3000); // AI đi sau 0.5s
        } else {
            console.warn("⚠ Nước đi không hợp lệ!");
            setErrorMessage("Nước đi không hợp lệ!");
            setTimeout(() => setErrorMessage(""), 1500);
        }
    }
};



  const boardSize = 500;
  const cellSize = boardSize / 9;

  return (
    <div className="flex flex-col items-center">
  <h1 className="text-4xl font-bold text-center text-[#003366] mb-2">
    Chế độ: {mode.toUpperCase()}
  </h1>
  <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
    Bạn chơi: {playerColor === "black" ? "♟️ Đen (Đi trước)" : "♟️ Đỏ"}
  </h2>

  <div className="relative w-[500px] h-[550px]">
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
  </div>
  <button
        onClick={() => navigate("/")} // Quay lại trang trước
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Quay lại
      </button>
</div>

  );
};

export default ChessboardAI;
