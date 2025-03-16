import React, { useEffect, useState } from "react";
import Chessboard from "../../Components/Chessboard";
import websocketService from "../../Services/webSocketServices";
import { useParams } from "react-router-dom"; // 📌 Lấy gameId từ URL

const Game = () => {
  const { gameId } = useParams(); // 📌 Lấy gameId từ URL
  const [playerBlack, setPlayerBlack] = useState(null);
  const [playerRed, setPlayerRed] = useState(null);
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username"); // 📌 Lấy username từ localStorage

  useEffect(() => {
    websocketService.connect(() => {
      // Khi kết nối WebSocket, gửi thông tin người chơi
      websocketService.send(`/topic/game/${gameId}/join`, { username });

      websocketService.subscribe(`/topic/game/${gameId}`, (message) => {
        console.log("📩 Tin nhắn mới:", message);

        // Nếu nhận được thông tin người chơi từ server
        if (message.type === "playerUpdate") {
          setPlayerBlack(message.playerBlack);
          setPlayerRed(message.playerRed);
        }

        setMessages((prevMessages) => [...prevMessages, message]);
      });
    });

    console.log(playerBlack);
    console.log(gameId);
    return () => {
      websocketService.unsubscribe(`/topic/game/${gameId}`);
      websocketService.disconnect();
    };
  }, [gameId, username]); // 📌 Lắng nghe thay đổi của gameId và username

  return (
    <div>
      <h1>WebSocket Connected to Game {gameId}!</h1>
      <h2>Người chơi: {playerBlack} (Đen) vs {playerRed || "Chờ đối thủ..."}</h2>
      <Chessboard gameId={gameId} playerBlack={playerBlack} playerRed={playerRed} />
      <div>
        <h2>📩 Tin nhắn nhận được:</h2>
        {messages.map((msg, index) => (
          <p key={index}>{JSON.stringify(msg)}</p>
        ))}
      </div>
    </div>
  );
};

export default Game;
