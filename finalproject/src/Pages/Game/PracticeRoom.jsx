import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../Services/apiConfig";
import Chessboard from "../../Components/Chessboard";

export default function PracticeRoom() {
  const navigate = useNavigate();
  const [playerRed, setPlayerRed] = useState("");
  const [playerBlack, setPlayerBlack] = useState("");
  const [currentGame, setCurrentGame] = useState(null);

  const createGame = async () => {
    if (!playerRed.trim() || !playerBlack.trim()) {
      alert("Tên người chơi không được để trống!");
      return;
    }
    try {
      const response = await apiClient.post("/games/create", {
        gameMode: "practice",
        playerRed,
        playerBlack
        
      }
      
    );
    navigate(`/practice/practiceRoom/${response.data.id}`)
      if (!response.data || !response.data.id) {
        alert("Lỗi khi tạo ván cờ!");
        return;
      }

      setCurrentGame(response.data);  // Cập nhật state
    } catch (error) {
      console.error("Lỗi tạo game:", error.response?.data || error.message);
      alert("Không thể tạo ván cờ!");
    }
  };

  // Theo dõi giá trị currentGame
  useEffect(() => {
    console.log("currentGame sau khi cập nhật:", currentGame);
  }, [currentGame]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center"
         style={{ backgroundImage: "url('../public/Assets/background.png')" }}>
      {!currentGame ? (
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-6xl font-bold mb-10 text-[#003366] drop-shadow-lg">Luyện Tập 2 Người Chơi</h1>
          <input
            type="text"
            placeholder="Tên người chơi Đen"
            value={playerBlack}
            onChange={(e) => setPlayerBlack(e.target.value)}
            className="border p-2 mb-2 w-64 text-center"
          />
          <input
            type="text"
            placeholder="Tên người chơi Đỏ"
            value={playerRed}
            onChange={(e) => setPlayerRed(e.target.value)}
            className="border p-2 mb-2 w-64 text-center"
          />
          <button onClick={createGame} className="bg-blue-500 text-white px-4 py-2 rounded">
            Tạo Ván Cờ
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <Chessboard gameId={currentGame?.id} playerBlack={currentGame?.playerBlack} playerRed={currentGame?.playerRed} gameMode={currentGame?.gameMode} />
        </div>
      )}
    </div>
  );
}
