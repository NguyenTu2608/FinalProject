import React, { useEffect, useState } from "react";
import Chessboard from "../../Components/Chessboard";
import websocketService from "../../Services/webSocketServices";
import { useParams } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // ✅ Lấy username từ token

const Game = () => {
  const { gameId } = useParams(); // 📌 Lấy gameId từ URL
  const [playerBlack, setPlayerBlack] = useState(null);
  const [playerRed, setPlayerRed] = useState(null);
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
    if (!username) {
      console.warn("⚠ Không tìm thấy username từ token!");
      
      return;
    }
    
    websocketService.connect(() => {
      console.log("📡 Đăng ký WebSocket vào game:", gameId);
      // Gửi yêu cầu tham gia game chỉ sau khi WebSocket kết nối
      setTimeout(() => {
        websocketService.sendJoinRequest(gameId, username);
        
      }, 500); // Chờ một chút để chắc chắn WebSocket đã kết nối
    });
  
    websocketService.subscribeToGame(gameId, (message) => {
      console.log("📩 Tin nhắn mới:", message)
      if (message.type === "playerUpdate") {
        console.log("👤 Cập nhật người chơi:", message.playerBlack, message.playerRed);
  
        // ✅ Nếu chưa có playerBlack, gán người đầu tiên vào
        if (!message.playerBlack) {
          message.playerBlack = username;
        }
        setPlayerBlack(message.playerBlack);
        setPlayerRed(message.playerRed);
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    return () => {
      websocketService.unsubscribeFromGame(gameId);
      websocketService.disconnect();
    };
  }, [gameId, username]);
  
  
  useEffect(() => {
    console.log("🔥 Player Black đã cập nhật:", playerBlack);
  }, [playerBlack]);// 📌 Lắng nghe thay đổi của gameId và username

  return (
    <div className="game-container">
      <h1>Trận đấu: {gameId}</h1>
      <h2>Người chơi Đen: {playerBlack || "Đang chờ..."}</h2>
      <h2>Người chơi Đỏ: {playerRed || "Đang chờ..."}</h2>
      <Chessboard gameId={gameId} username={username} />

      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index}>{msg.content}</p>
        ))}
      </div>
    </div>
  );
};

export default Game;
