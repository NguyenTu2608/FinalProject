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
  
      console.log("Phản hồi từ API /games/create:", response.data);
      
      if (!response.data || !response.data.id) {
        console.error("Lỗi: API không trả về ID của game!");
        alert("Lỗi khi tạo ván cờ! Vui lòng thử lại.");
        return;
      }
  
      setCurrentGame(response.data);
      setMoveHistory([]); // Reset lịch sử nước đi khi tạo ván mới
    } catch (error) {
      console.error("Error creating game:", error.response ? error.response.data : error.message);
      alert("Không thể tạo ván cờ! Hãy kiểm tra kết nối đến server.");
    }
  };
  

  const handleMove = async (move) => {
    if (!currentGame || !currentGame.id) {
      console.error("Lỗi: currentGame chưa được khởi tạo!", currentGame);
      alert("Vui lòng tạo ván cờ trước!");
      return;
    }
  
    console.log("Nước đi gửi lên server:", move);
  
    try {
      const response = await apiClient.post(`/games/${currentGame.id}/move`, move);
  
      if (!response.data || !response.data.id) {
        console.error("Lỗi: Phản hồi từ API không hợp lệ!", response.data);
        alert("Lỗi từ server! Vui lòng thử lại.");
        return;
      }
  
      setCurrentGame(response.data);
      setMoveHistory(response.data.moves);
    } catch (error) {
      console.error("Lỗi khi gửi nước đi lên server:", error);
      alert("Lỗi kết nối server!");
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
          <Chessboard 
            currentGame={currentGame} 
            setCurrentGame={setCurrentGame} 
            moveHistory={moveHistory} 
            handleMove={handleMove} 
          />
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