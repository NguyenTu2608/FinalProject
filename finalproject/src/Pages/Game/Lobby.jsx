import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Profile from "../../Components/Profile";
import apiClient from "../../Services/apiConfig";
import websocketService from "../../Services/webSocketServices";

const Lobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [gameId, setGameId] = useState(null); // ✅ Lưu gameId để hủy sub khi rời Lobby

  useEffect(() => {
    websocketService.connect();

    return () => {
      if (gameId) {
        websocketService.unsubscribeFromGame(gameId); // ✅ Gọi đúng hàm hủy đăng ký
      }
      websocketService.disconnect();
    };
  }, [gameId]); // ✅ Gọi lại useEffect nếu gameId thay đổi

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

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const username = getUsernameFromToken();
      if (!username) {
        alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!");
        setLoading(false);
        return;
      }
      const response = await apiClient.post("/games/create", {
        gameMode: "online",
        playerBlack: username,
      });

      const newGameId = response.data.id;
      setGameId(newGameId); // ✅ Lưu gameId để dùng trong `unsubscribeFromGame`
      navigate(`/Lobby/game/${newGameId}`);

      websocketService.sendJoinRequest(newGameId, username);
    } catch (error) {
      console.error("❌ Lỗi khi tạo phòng:", error);
      alert("Không thể tạo phòng. Vui lòng thử lại!");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Assets/background.png')" }}
    >
      <div className="absolute top-0 left-0 w-full p-4">
        <Profile />
      </div>

      <h1 className="text-6xl font-bold mb-10 text-[#003366] drop-shadow-lg">Chế độ Online</h1>

      <div className="flex flex-col gap-6 w-80">
        <button
          onClick={handleCreateRoom}
          disabled={loading}
          className="w-full py-4 bg-blue-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-blue-700 shadow-md"
        >
          {loading ? "⏳ Đang tạo phòng..." : "🏠 Tạo phòng"}
        </button>

        <button
          onClick={() => navigate("/Lobby/tim-phong")}
          className="w-full py-4 bg-green-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md"
        >
          🔍 Tìm phòng
        </button>

        <button
          onClick={() => navigate("/Lobby/gia-nhap-phong")}
          className="w-full py-4 bg-yellow-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-yellow-700 shadow-md"
        >
          🔑 Gia nhập phòng ngẫu nhiên
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Quay lại
      </button>
    </div>
  );
};

export default Lobby;
