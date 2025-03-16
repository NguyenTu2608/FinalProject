import React, { useEffect, useState } from "react";
import Chessboard from "../../Components/Chessboard";
import websocketService from "../../Services/webSocketServices";
import { useParams } from "react-router-dom"; // 📌 Lấy gameId từ URL

const Game = () => {
  const { gameId } = useParams(); // 📌 Lấy gameId từ URL
  const [playerBlack, setPlayerBlack] = useState(null);
  const [playerRed, setPlayerRed] = useState(null);
  const [messages, setMessages] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    websocketService.connect(() => {
      websocketService.subscribe(`/topic/game/${gameId}`, (message) => {
        console.log("📩 Tin nhắn mới:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    });

    return () => {
      websocketService.unsubscribe(`/topic/game/${gameId}`);
      websocketService.disconnect();
    };
  }, [gameId]); // 📌 Lắng nghe thay đổi của gameId

  return (
    <div>
      <h1>WebSocket Connected to Game {gameId}!</h1>
      <Chessboard gameId={gameId}/>
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
