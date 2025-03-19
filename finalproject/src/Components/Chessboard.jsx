import React, { useState, useEffect } from "react";
import GameManager from "./GameManager";
import apiClient from "../Services/apiConfig";
import websocketService from "../Services/webSocketServices";
// Ảnh quân cờ
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
const Chessboard = ({ gameId, playerBlack, playerRed, gameMode, username }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("black"); // 'red' hoặc 'black'
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const gameManager = new GameManager(board);

  useEffect(() => {
    if (gameMode !== "online") return;

    console.log("📡 Kết nối WebSocket để nhận nước đi...");

    websocketService.subscribeToGame(gameId, (message) => {
      if (message.type === "gameMove") {
        console.log("♟️ Nhận gameMove từ WebSocket:", message);

        setBoard((prevBoard) => {

          if (!message.from || !message.to) {
              console.warn("⚠ Lỗi: Dữ liệu nước đi không hợp lệ!", message);
              return prevBoard;
          }
      
          const { from, to } = message;
      
          // Kiểm tra xem tọa độ có hợp lệ không
          if (from.row < 0 || from.row >= 10 || from.col < 0 || from.col >= 9 ||
              to.row < 0 || to.row >= 10 || to.col < 0 || to.col >= 9) {
              console.warn("⚠ Lỗi: Nước đi ngoài phạm vi bàn cờ!", from, to);
              return prevBoard;
          }
      
          // Tạo bản sao sâu của bàn cờ
          const updatedBoard = prevBoard.map(row => [...row]);
      
          // Kiểm tra xem có quân cờ ở vị trí cũ không
          if (!updatedBoard[from.row][from.col]) {
              console.warn("⚠ Không tìm thấy quân cờ ở vị trí cũ:", from);
              return prevBoard;
          }
      
          // Thực hiện nước đi
          updatedBoard[to.row][to.col] = updatedBoard[from.row][from.col];
          updatedBoard[from.row][from.col] = null;
      
          return updatedBoard;
      });
      
  

        setMoveHistory((prevHistory) => [...prevHistory, message]);

        // 🔥 Cập nhật lượt chơi từ WebSocket
        setCurrentPlayer((prev) => {
          console.log("🛠️ Trước khi cập nhật lượt:", prev);
          console.log("🔄 Cập nhật lượt chơi thành:", message.currentTurn);
          return message.currentTurn;
        });
      }
    });

    return () => {
      websocketService.unsubscribeFromGame(gameId);
    };
  }, [gameId, gameMode]);



  if (!gameStarted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg text-center animate-fade-in">
          {gameMode === "practice" ? (
            <button
              onClick={() => setGameStarted(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl"
            >
              Bấm để bắt đầu
            </button>
          ) : (
            <div>
              <p className="mb-4 text-lg font-semibold">Đang chờ người chơi khác...</p>
              <button
                onClick={() => setGameStarted(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl"
              >
                Sẵn sàng
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleClick = async (row, col) => {
    if (gameMode === "online") {
      // 🔥 Kiểm tra nếu không phải lượt của người chơi trong chế độ online
      if ((currentPlayer === "black" && username !== playerBlack) ||
        (currentPlayer === "red" && username !== playerRed)) {
        console.log("🚫 Không phải lượt của bạn!");
        setErrorMessage("Không phải lượt của bạn!");
        setErrorMessage("");
        return;
      }


    }

    const piece = board[row][col];
    const isRedPiece = piece && piece === piece.toLowerCase(); // Quân đỏ là chữ thường
    const isBlackPiece = piece && piece === piece.toUpperCase(); // Quân đen là chữ hoa
    if (selectedPiece) {
      if (validMoves.some(([r, c]) => r === row && c === col)) {
        if (gameManager.isMoveCausingCheck(selectedPiece.row, selectedPiece.col, row, col, currentPlayer === "red")) {
          setErrorMessage("Nước đi này sẽ gây chiếu tướng!");
          return; // Không thực hiện nước đi
        }
        // Move the piece
        const newBoard = gameManager.movePiece(
          selectedPiece.row,
          selectedPiece.col,
          row,
          col
        );
        const move = {
          gameId,
          from: { row: selectedPiece.row, col: selectedPiece.col },
          to: { row, col },
          piece: selectedPiece.piece,
          player: currentPlayer,
        };
        // 📡 Gửi nước đi lên server nếu là chế độ online
        if (gameMode === "online") {
          console.log("📡 Gửi nước đi qua WebSocket:", move);
          websocketService.sendMove(gameId, move);
        }

        try {
          await apiClient.post(`/games/${gameId}/moves`, move); // Gửi nước đi lên server
          console.log("Move successfully sent to server");
        } catch (error) {
          console.error("Failed to send move to server", error);
        }

        console.log("Nước đi mới:", move); // Kiểm tra log
        console.log("Lịch sử nước đi:", [...moveHistory, move]); // Kiểm tra toàn bộ lịch sử

        setMoveHistory(prevHistory => [...prevHistory, move]); // Cập nhật lịch sử


        // Xác định lượt chơi tiếp theo
        const nextPlayer = currentPlayer === "red" ? "black" : "red";
        const newGameManager = new GameManager(newBoard);
        // Kiểm tra xem bên được chuyển giao có bị chiếu bí hay không
        if (newGameManager.isCheckmate(nextPlayer === "red")) {
          setGameOver(true);
          setWinner(nextPlayer);
          setErrorMessage(
            `${nextPlayer === "red" ? "Đỏ" : "Đen"} bị chiếu bí! Trò chơi kết thúc.`
          );
        }

        setBoard([...newBoard]); // Ensure a new state reference
        setSelectedPiece(null);
        setValidMoves([]);
        setErrorMessage("");

        // Kiểm tra xem Tướng của đối phương có bị chiếu hay không
        const opponentIsRed = currentPlayer === "black";
        if (gameManager.isKingInCheck(opponentIsRed)) {
          setErrorMessage("Chiếu tướng!");
          // Kiểm tra xem có phải là chiếu bí hay không
          if (gameManager.isCheckmate(opponentIsRed)) {
            setErrorMessage("Chiếu bí! Trò chơi kết thúc.");
            // Có thể thêm logic kết thúc trò chơi ở đây
          }
        }
        if (!gameOver) setCurrentPlayer(nextPlayer);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
        // setErrorMessage("Nước đi không hợp lệ!");
      }
    } else if (piece)
      if ((currentPlayer === "red" && isRedPiece) || (currentPlayer === "black" && isBlackPiece)) {

        const valid = gameManager.getValidMoves(piece, row, col);
        setSelectedPiece({ row, col, piece });
        setValidMoves(valid);
        setErrorMessage(""); // Xóa thông báo lỗi
      }
      else {
        // setErrorMessage("Không phải lượt của bạn!");
      }
  };

  const restartGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer(winner);
    setSelectedPiece(null);
    setValidMoves([]);
    setErrorMessage("");
    setGameOver(false);
    setWinner(null);
  };

  const boardSize = 500;
  const cellSize = boardSize / 9;

  const ProfileCard = () => {
    return (
      <div className="flex flex-col items-center bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg w-64 text-white">
        {/* Ảnh đại diện */}
        <div className="relative">
          <img
            src="/Assets/avatar.png" // Thay bằng ảnh thực tế
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-orange-500"
          />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-orange-500 px-4 py-1 rounded-md text-lg font-bold">
            Tập sự
            <span className="block text-center text-yellow-300 text-sm">⭐</span>
          </div>
        </div>

        {/* Mã người chơi */}
        <div className="bg-gray-700 text-yellow-300 text-lg font-semibold mt-6 px-6 py-2 rounded-lg w-full text-center">
          917E7B212E...
        </div>

        {/* Đồng hồ đếm ngược */}
        <div className="flex items-center mt-4 bg-yellow-500 px-6 py-2 rounded-lg text-black font-bold">
          ⏳ 15:00
        </div>
      </div>
    );
  };

  // export default ProfileCard;

  return (
    <div className="flex justify-center items-center space-x-8">
      {/* ProfileCard */}
      <ProfileCard />
      <div className="relative w-[500px] h-[550px] mx-auto">
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
            className="absolute w-[45px] h-[45px] bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${col * cellSize + cellSize / 2}px`,
              top: `${row * cellSize + cellSize / 2}px`,
            }}
            onClick={() => handleClick(row, col)}
          />
        ))}

        {/* Hiển thị thông báo lỗi */}
        {errorMessage && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-2 rounded">
            {errorMessage}
          </div>
        )}

        {/* Hiển thị lượt hiện tại trên bàn cờ */}
        <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded">
          Lượt hiện tại: {currentPlayer === "red" ? "Đỏ" : "Đen"}
        </div>


        {/* Overlay hiển thị khi trò chơi kết thúc */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-2xl font-bold mb-4">Trò chơi kết thúc!</h2>
              <p className="mb-4">
                {winner === "red" ? "Đỏ" : "Đen"} bị chiếu bí!
              </p>
              <button
                onClick={restartGame}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>
      {/* ProfileCard bên phải (đối xứng) */}
      <ProfileCard />
    </div>
  );


};

export default Chessboard;
