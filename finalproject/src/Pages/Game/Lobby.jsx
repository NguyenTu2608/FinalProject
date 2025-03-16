import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../Components/Profile";
import apiClient from "../../Services/apiConfig";

const Lobby = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post("/games/create", {
        gameMode: "online",
        playerBlack: localStorage.getItem("username"),
      });
  
      navigate(`/Lobby/game/${response.data.id}`); // 🏠 Chuyển vào phòng vừa tạo
    } catch (error) {
      console.error("❌ Lỗi khi tạo phòng:", error);
    }
    setLoading(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Assets/background.png')" }}
    >
      <div className="absolute top-0 left-0 w-full p-4">
        <Profile  />
      </div>
      {/* Tiêu đề */}
      <h1 className="text-6xl font-bold mb-10 text-[#003366] drop-shadow-lg">Chế độ Online</h1>

      {/* Các nút lựa chọn */}
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

      {/* Nút Back */}
      <button
        onClick={() => navigate(-1)} // Quay lại trang trước
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Quay lại
      </button>
    </div>
  );
};

export default Lobby;
