import React, { useEffect, useState } from "react";
import Chessboard from "../../Components/Chessboard";
import websocketService from "../../Services/webSocketServices";
import { useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // ✅ Lấy username từ token

const Game = () => {
  const { gameId } = useParams(); // 📌 Lấy gameId từ URL
  const [playerBlack, setPlayerBlack] = useState(null);
  const [playerRed, setPlayerRed] = useState(null);
  const [gameMode, setGameMode] = useState("online");
  const [messages, setMessages] = useState([]);
  
  // ✅ Lấy username từ token
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

  const username = getUsernameFromToken(); // 📌 Lấy username từ token
  useEffect(() => {
    websocketService.connect(() => {
      console.log("✅ WebSocket đã kết nối, gửi yêu cầu tham gia game:", gameId);
      websocketService.sendJoinRequest(gameId, username);
  
      websocketService.subscribeToGame(gameId, (message) => {
        console.log("📩 Tin nhắn mới từ WebSocket:", message);
  
        if (message.type === "playerUpdate") {
          console.log("👤 Nhận playerUpdate:", message.playerBlack, message.playerRed);
  
          setTimeout(() => {
            setPlayerBlack(message.playerBlack);
            setPlayerRed(message.playerRed);
          }, 0);
        }
      });
    });
  
    return () => {
      websocketService.unsubscribeFromGame(gameId);
      websocketService.disconnect();
    };
  }, [gameId, username]);
  
  
  useEffect(() => {
    console.log("🔥 Player Black đã cập nhật:", playerBlack);
    console.log("🔥 Player Red đã cập nhật:", playerRed);
  }, [playerBlack, playerRed]);// 📌 Lắng nghe thay đổi của gameId và username

  return (
    <div className="game-container">
      <h1>Trận đấu: {gameId}</h1>
      <h2>Người chơi Đen: {playerBlack || "Đang chờ..."}</h2>
      <h2>Người chơi Đỏ: {playerRed || "Đang chờ..."}</h2>
      <Chessboard 
          gameId={gameId} 
          playerBlack={playerBlack} 
          playerRed={playerRed} 
          gameMode={gameMode}
          username={username}
      />

      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}>{msg.content}</p>
        ))}
      </div>
    </div>
  );
};

export default Game;
