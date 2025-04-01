import { useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "./Services/apiConfig";
import Chessboard from "./Components/Chessboard";

export default function PracticeRoom() {
  const navigate = useNavigate();
  const [playerRed, setPlayerRed] = useState("");
  const [playerBlack, setPlayerBlack] = useState("Pikafish");
  const [currentGame, setCurrentGame] = useState(null);
  const [gameMode, setGameMode] = useState("practice");

  const createGame = async () => {
    if (!playerRed.trim()) return alert("Tên người chơi không được để trống!");
    try {
      const response = await apiClient.post("/games/create", {
        gameMode: gameMode === "ai" ? "ai" : "practice",
        playerRed,
        playerBlack: gameMode === "ai" ? "Pikafish" : playerBlack,
      });
      navigate(`/practice/practiceRoom/${response.data.id}`);
      setCurrentGame(response.data);
    } catch (error) {
      console.error("Lỗi tạo game:", error);
      alert("Không thể tạo ván cờ!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('../public/Assets/background.png')" }}>
      {!currentGame ? (
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-10 text-[#003366]">Luyện Tập</h1>
          <input
            type="text"
            placeholder="Tên người chơi Đỏ"
            value={playerRed}
            onChange={(e) => setPlayerRed(e.target.value)}
            className="border p-2 mb-2 w-64 text-center"
          />
          {gameMode === "practice" && (
            <input
              type="text"
              placeholder="Tên người chơi Đen"
              value={playerBlack}
              onChange={(e) => setPlayerBlack(e.target.value)}
              className="border p-2 mb-2 w-64 text-center"
            />
          )}
          <select value={gameMode} onChange={(e) => setGameMode(e.target.value)} className="border p-2 mb-2 w-64 text-center">
            <option value="practice">Hai người chơi</option>
            <option value="ai">Chơi với Pikafish</option>
          </select>
          <button onClick={createGame} className="bg-blue-500 text-white px-4 py-2 rounded">
            Tạo Ván Cờ
          </button>
        </div>
      ) : (
        <Chessboard
          gameId={currentGame?.id}
          playerBlack={currentGame?.playerBlack}
          playerRed={currentGame?.playerRed}
          gameMode={currentGame?.gameMode}
          username={playerRed}
        />
      )}
    </div>
  );
}