import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Chessboard from "../../Components/Chessboard";
import websocketService from "../../Services/webSocketServices";
import { jwtDecode } from "jwt-decode";

const Game = () => {
  const { gameId } = useParams();
  const [playerBlack, setPlayerBlack] = useState(null);
  const [playerRed, setPlayerRed] = useState(null);
  const [gameMode, setGameMode] = useState("online");
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isVisible, setIsVisible] = useState(true); // ✅ Trạng thái hiển thị chat box
  const [hasNewMessage, setHasNewMessage] = useState(false);
  
  const messagesEndRef = useRef(null); // 👉 Auto scroll

  const navigate = useNavigate();
  
  const handleLeaveGame = () => {
    if (!gameId || !username) return;
    websocketService.sendLeaveRequest(gameId, username);
    navigate("/Lobby");
  };
  
  const getUsernameFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const decoded = jwtDecode(token);
      return decoded.username || decoded.sub;
    } catch (error) {
      console.error("❌ Lỗi khi giải mã token:", error);
      return null;
    }
  };
  const username = getUsernameFromToken();
  

  // --- Websocket Setup ---
  useEffect(() => {
    websocketService.connect(() => {
      websocketService.sendJoinRequest(gameId, username);
      websocketService.subscribeToGame(gameId, (message) => {
        if (message.type === "playerUpdate") {
          setPlayerBlack(message.playerBlack);
          setPlayerRed(message.playerRed);
        } 
      });
      // Chat subscription
      websocketService.subscribeToChat(gameId, (chatMsg) => {
        console.log("💬 Nhận tin nhắn chat:", chatMsg);
        setMessages((prev) => [...prev, chatMsg]);
      });

    });
    return () => {
      websocketService.unsubscribeFromGame(gameId);
      websocketService.unsubscribeFromChat(gameId);
      websocketService.disconnect();
    };
  }, [gameId, username, navigate]);


  const sendMessage = () => {
    if (inputMessage.trim() === "") return;
    websocketService.sendChatMessage(gameId, username, inputMessage);
    setInputMessage("");
  };

  useEffect(() => {
    if (messages.length === 0) return;
    if (!isVisible) {
      // Tin nhắn mới đến khi chat ẩn => bật nháy
      setHasNewMessage(true);
    } else {
      // Chat đang hiển thị => tắt nháy (đã đọc)
      setHasNewMessage(false);
    }
    // Scroll xuống cuối
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isVisible]);


  return (
    <div className="game-container p-4">
      <h1 className="text-2xl font-bold mb-4">Trận đấu: {gameId}</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <h2 className="mb-2">Người chơi Đen: <span className="font-semibold">{playerBlack || "Đang chờ..."}</span></h2>
      <h2 className="mb-4">Người chơi Đỏ: <span className="font-semibold">{playerRed || "Đang chờ..."}</span></h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Chessboard 
            gameId={gameId} 
            playerBlack={playerBlack} 
            playerRed={playerRed}
            gameMode={gameMode}
            username={username}
          />
        </div>
      </div>
      <div className="fixed bottom-5 right-5">
      {/* Toggle Button */}
      {!isVisible && (
        <button
          onClick={() => {
            setIsVisible(true);
            setHasNewMessage(false); // Mở chat => dừng nháy
          }}
          className={`bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 transition ${
            hasNewMessage ? "animate-pulse" : ""
          }`}
        >
          💬 Chat
        </button>
      )}

      {/* Chat Box */}
      {isVisible && (
        <div className="w-80 flex flex-col border border-gray-500/50 rounded-xl backdrop-blur-md bg-white/10 shadow-lg">
          {/* Header */}
          <div className="p-2 rounded-t-xl text-white font-semibold text-sm border-b border-gray-500/30 flex justify-between items-center">
            <span>💬 Chat</span>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white text-xs hover:text-red-400 transition"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-2 overflow-y-auto max-h-64">
          {messages.map((msg, index) => {
            const isSender = msg.sender === username;
            return (
              <div key={index} className={`mb-2 ${isSender ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block px-4 py-2 rounded-lg shadow ${
                isSender
                  ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
                }`}
                >
                  <strong>{isSender ? 'Bạn' : msg.sender}:</strong> {msg.content}
                </div>
              </div>
            );
          })}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-2 flex gap-2 border-t border-gray-500/30">
            <input
              type="text"
              className="flex-1 border border-gray-500/50 bg-transparent rounded-full px-3 py-1 text-sm text-white focus:outline-none focus:ring focus:ring-blue-400"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition text-sm"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
      <button
        onClick={handleLeaveGame}
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Rời Phòng
      </button>
    </div>
  );
};

export default Game;
