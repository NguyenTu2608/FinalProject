import { useState } from "react";
import apiClient from "../../Services/apiConfig";
import Chessboard from "./Game";

export default function PracticeRoom() {
  const [playerRed, setPlayerRed] = useState("");
  const [playerBlack, setPlayerBlack] = useState("");
  const [currentGame, setCurrentGame] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);

  const createGame = async () => {
    if (!playerRed.trim() || !playerBlack.trim()) {
      alert("Tên người chơi không được để trống!");
      return;
    }
    try {
      const response = await apiClient.post("/games/create", {
        playerRed,
        playerBlack,
      });
      setPlayerRed("");
      setPlayerBlack("");
      setCurrentGame(response.data);
      setMoveHistory([]);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const makeMove = async (move) => {
    if (!currentGame) return;
    try {
      const response = await apiClient.post(`/games/${currentGame.id}/move`, move);
      setCurrentGame(response.data);
      setMoveHistory((prev) => [...prev, move]); // Cập nhật lịch sử nước đi
    } catch (error) {
      console.error("Error making move:", error);
    }
  };

  return (
    <div
  className="flex items-center justify-center min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('../public/Assets/background.png')" }}
>
      {!currentGame ? (
        
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-10 text-[#003366] drop-shadow-lg">Luyện Tập 2 Người Chơi</h1>
          <input
            type="text"
            placeholder="Tên người chơi Đỏ"
            value={playerRed}
            onChange={(e) => setPlayerRed(e.target.value)}
            className="border p-2 mb-2 w-64 text-center"
          />
          <input
            type="text"
            placeholder="Tên người chơi Đen"
            value={playerBlack}
            onChange={(e) => setPlayerBlack(e.target.value)}
            className="border p-2 mb-2 w-64 text-center"
          />
          <button onClick={createGame} className="bg-blue-500 text-white px-4 py-2 rounded">
            Tạo Ván Cờ
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <Chessboard makeMove={makeMove} currentGame={currentGame} />
          <div className="mt-4 w-full max-w-md">
            <h3 className="text-md font-bold">Lịch sử nước đi</h3>
            <ul className="list-disc pl-5">
              {moveHistory.map((move, index) => (
                <li key={index}>{`${move.player}: ${move.piece} từ (${move.from.row}, ${move.from.col}) đến (${move.to.row}, ${move.to.col})`}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}