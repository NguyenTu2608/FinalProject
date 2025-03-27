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
const Chessboard = ({ gameId, playerBlack, playerRed, setPlayerBlack, setPlayerRed, gameMode, username }) => {
  const [board, setBoard] = useState(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState("black"); // 'red' hoặc 'black'
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const gameManager = new GameManager(board);
  const [timeLeftRed, setTimeLeftRed] = useState(900); // 15 phút = 900 giây
  const [timeLeftBlack, setTimeLeftBlack] = useState(900);
  const [timerActive, setTimerActive] = useState(false);
  const [readyStatus, setReadyStatus] = useState({ black: false, red: false });
  const [gameStarted, setGameStarted] = useState(false);
  const [endReason, setEndReason] = useState(null);

  useEffect(() => {
    let interval;
    if (timerActive && gameStarted && currentPlayer && !gameOver) {
      interval = setInterval(() => {
        if (currentPlayer === 'red') {
          setTimeLeftRed(prev => prev > 0 ? prev - 1 : 0);
        } else {
          setTimeLeftBlack(prev => prev > 0 ? prev - 1 : 0);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timerActive, gameStarted, gameOver, currentPlayer]);


  useEffect(() => {
    if (gameMode !== "online") return;
  
    console.log("📡 Kết nối WebSocket để nhận nước đi...");
    
    if (!websocketService.isConnected) {
      console.warn("⚠ WebSocket chưa kết nối, thử kết nối lại...");
      websocketService.connect(() => {
        console.log("🔄 Đã kết nối lại WebSocket!");
        websocketService.subscribeToGame(gameId, handleGameMove);
      });
    } else {
      websocketService.subscribeToGame(gameId, handleGameMove);
    }
  
    return () => {
      websocketService.unsubscribeFromGame(gameId);
    };
  
  }, [gameId, gameMode]);

  

  //nhan message san sang`
  useEffect(() => {
    if (gameMode !== "online") return;
  
    const handleReadyMessage = (messageReady) => {
      let response;
  
      // Kiểm tra nếu messageReady.body tồn tại và là chuỗi JSON
      if (messageReady.body && typeof messageReady.body === "string") {
          try {
              response = JSON.parse(messageReady.body);
          } catch (error) {
              console.error("❌ LỖI: Không thể parse JSON từ WebSocket!", error);
              return;
          }
      } else if (typeof messageReady === "object") {
          response = messageReady; // Nếu đã là object thì sử dụng luôn
      } else {
          console.error("❌ LỖI: Dữ liệu WebSocket không hợp lệ!", messageReady);
          return;
      }
  
      console.log("📩 Nhận tin nhắn:", response);
  
      if (response.type === "readyStatus") {
          setReadyStatus({
              black: response.blackReady,
              red: response.redReady,
          });
      } else if (response.type === "gameStart") {
          setGameStarted(true);
          setTimerActive(true);
      }
  };
  
    websocketService.subscribeToGame(gameId, handleReadyMessage);
  
    return () => {
      websocketService.unsubscribeFromGame(gameId);
    };
  
  }, [gameId, gameMode]);

  useEffect(() => {
    if (gameMode !== "online") return;

    const handlePlayerLeft = (message) => {
        let response;

        // Kiểm tra xem message có phải là JSON hợp lệ không
        if (message.body && typeof message.body === "string") {
            try {
                response = JSON.parse(message.body);
            } catch (error) {
                console.error("❌ LỖI: Không thể parse JSON!", error);
                return;
            }
        } else if (typeof message === "object") {
            response = message;
        } else {
            console.error("❌ LỖI: Dữ liệu WebSocket không hợp lệ!", message);
            return;
        }

        console.log("📩 Nhận thông báo rời phòng:", response);

        if (response.type === "playerUpdate") {
            setPlayerBlack(response.playerBlack || null);
            setPlayerRed(response.playerRed || null);
            
            // Nếu có một người rời đi, đặt lại trạng thái sẵn sàng
            if (!response.playerBlack || !response.playerRed) {
                console.log("🔄 Một người đã rời phòng, reset trạng thái sẵn sàng.");
                setReadyStatus({ black: false, red: false });
                setGameStarted(false);
                setTimerActive(false);
            }
        }
    };

    websocketService.subscribeToGame(gameId, handlePlayerLeft);

    return () => {
        websocketService.unsubscribeFromGame(gameId);
    };

}, [gameId, gameMode]);


  //truyen san sang len server
  const sendReadyStatus = () => {
    websocketService.sendReadyRequest(gameId, username);
  };

  const sendEndReason = () => {
    websocketService.sendEndReason(gameId,username,endReason);
  };

  
  // 👉 Tách riêng logic xử lý nước đi từ WebSocket
  const handleGameMove = (message) => {
    if (message.type !== "gameMove") return;

    console.log("♟️ Nhận gameMove từ WebSocket:", message);

    setBoard((prevBoard) => {
      if (!message.from || !message.to) {
        console.warn("⚠ Lỗi: Dữ liệu nước đi không hợp lệ!", message);
        return prevBoard;
      }

      const { from, to } = message;

      if (from.row < 0 || from.row >= 10 || from.col < 0 || from.col >= 9 ||
        to.row < 0 || to.row >= 10 || to.col < 0 || to.col >= 9) {
        console.warn("⚠ Lỗi: Nước đi ngoài phạm vi bàn cờ!", from, to);
        return prevBoard;
      }

      // 🔥 Sao chép mảng đúng cách để tránh lỗi React không cập nhật state
      const updatedBoard = prevBoard.map(row => [...row]);

      if (!updatedBoard[from.row][from.col]) {
        console.warn("⚠ Không tìm thấy quân cờ ở vị trí cũ:", from);
        return prevBoard;
      }

      updatedBoard[to.row][to.col] = updatedBoard[from.row][from.col];
      updatedBoard[from.row][from.col] = null;

      return [...updatedBoard]; // ✅ Cập nhật lại state để React nhận diện thay đổi
    });

    setMoveHistory((prevHistory) => [...prevHistory, message]);

    if (message.currentTurn) {
      console.log("🔄 [Client] Cập nhật lượt chơi:", message.currentTurn);
      setCurrentPlayer(message.currentTurn);
      setTimerActive(true);

    } else {
      console.warn("⚠ Không nhận được currentTurn từ WebSocket!");
    }
  };

  const handleTimeOut = (player) => {
    setGameOver(true);
    setWinner(player === 'red' ? 'black' : 'red');
    setErrorMessage(`${player === 'red' ? 'Đỏ' : 'Đen'} hết thời gian!`);
  };
  // Hàm định dạng thời gian
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const handleSurrender = (player) => {
    if (gameOver) return; // Nếu game đã kết thúc, không cần xử lý
    setGameOver(true);
    setWinner(player === "red" ? "black" : "red");
    setErrorMessage(`${player === "red" ? "Đỏ" : "Đen"} đã đầu hàng!`);
  };


  if (!gameStarted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg text-center animate-fade-in">
          {gameMode === "practice" ? (
            <button
              onClick={() => {
                setGameStarted(true);
                setTimerActive(true);
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl"
            >
              Bấm để bắt đầu
            </button>
          ) : (
            <div>
              <p className="mb-4 text-lg font-semibold">Đang chờ người chơi khác...</p>
              <button
                onClick={sendReadyStatus}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg hover:shadow-xl"
              >
                {readyStatus[username === playerBlack ? "black" : "red"]
                        ? "Đã Sẵn Sàng"
                        : "Sẵn Sàng"
                        }
                        
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleClick = async (row, col) => {
    console.log("📍 Nhấn vào ô:", row, col, " | Người chơi hiện tại:", currentPlayer);

    if (gameMode === "online") {
      if (!username) {
        console.warn("⚠ Không lấy được username! Kiểm tra token đăng nhập.");
        return;
      }

      if (!playerBlack || !playerRed) {
        console.warn("⚠ Chưa có đủ hai người chơi!");
        return;
      }

      if (currentPlayer !== "black" && currentPlayer !== "red") {
        console.warn("⚠ Lượt chơi không hợp lệ:", currentPlayer);
        return;
      }

      // 🔥 Kiểm tra nếu không phải lượt của người chơi hiện tại
      const isNotTurn =
        (currentPlayer === "black" && username !== playerBlack) ||
        (currentPlayer === "red" && username !== playerRed);

      if (isNotTurn) {
        console.log("🚫 Không phải lượt của bạn! Người chơi hiện tại:", currentPlayer, "| Bạn:", username);
        setErrorMessage("Không phải lượt của bạn!");
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
        } else {
          try {
            await apiClient.post(`/games/${gameId}/moves`, move);
            console.log("Move successfully sent to server");
          } catch (error) {
            console.error("Failed to send move to server", error);
          }
        }
        console.log("Nước đi mới:", move); // Kiểm tra log

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
    setCurrentPlayer("black"); // hoặc chọn màu bạn muốn đi trước
    setSelectedPiece(null);
    setValidMoves([]);
    setErrorMessage("");
    setGameOver(false);
    setWinner(null);
    setTimeLeftRed(900);
    setTimeLeftBlack(900);
    setTimerActive(true);
  };



  const ProfileCard = ({ timeLeft, isCurrentPlayer, playerType, onSurrender }) => {
    return (
      <div className={`flex flex-col items-center bg-gray-900 bg-opacity-80 p-4 rounded-lg shadow-lg w-64 text-white 
        ${isCurrentPlayer ? 'ring-2 ring-yellow-500' : ''}`}>
        <div className="relative">
          <img
            src="/Assets/avatar.png"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-orange-500"
          />
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-orange-500 px-4 py-1 rounded-md text-lg font-bold">
            {playerType === 'red' ? 'Đỏ' : 'Đen' || "Đang chờ..."} 
          </div>
        </div>

        <div className="bg-gray-700 text-yellow-300 text-lg font-semibold mt-6 px-6 py-2 rounded-lg w-full text-center">
          {playerType === 'red' ? playerRed : playerBlack}
        </div>

        <div className={`flex items-center mt-4 px-6 py-2 rounded-lg font-bold ${isCurrentPlayer ? 'bg-yellow-500 text-black' : 'bg-gray-700'
          }`}>
          ⏳ {formatTime(timeLeft)}
        </div>
        <button
          onClick={onSurrender}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <img
            src="/Assets/surrender.png"
            alt="Flag"
            className="w-5 h-5 mr-2"
          />
          Đầu hàng
        </button>
      </div>
    );
  };
  const boardSize = 500;
  const cellSize = boardSize / 9;

  return (
    <div className="flex justify-center items-center space-x-8">
      {/* ProfileCard */}
      <ProfileCard
        timeLeft={timeLeftBlack}
        isCurrentPlayer={currentPlayer === 'black' && !gameOver}
        playerType="black"
        onSurrender={() => handleSurrender("black")}
      />

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
            className="absolute w-[45px] h-[45px] bg-green-500 opacity-50 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
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
        {/* Overlay hiển thị khi trò chơi kết thúc */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Trò chơi kết thúc!</h2>
            <p className="mb-4">
              {errorMessage || `${winner === "red" ? "Đỏ" : "Đen"} thắng!`}
            </p>
            <button
              onClick={restartGame}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Start Game
            </button>
          </div>
        </div>
        )}
      </div>
      {/* ProfileCard bên phải (đối xứng) */}
      <ProfileCard
        timeLeft={timeLeftRed}
        isCurrentPlayer={currentPlayer === 'red' && !gameOver}
        playerType="red"
        onSurrender={() => handleSurrender("red")}
      />
      
    </div>
  );


};

export default Chessboard;
