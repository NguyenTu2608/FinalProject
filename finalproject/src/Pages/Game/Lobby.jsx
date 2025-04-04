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
  const [roomId, setRoomId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

   // Hàm để mở modal nhập tên phòng
   const openModal = () => {
    setIsModalOpen(true);
  };

  // Hàm để đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setRoomName(""); // Reset tên phòng
  };

  const openModal1 = () => {
    setIsModalOpen(true);
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
      if (!roomName) {
        alert("Vui lòng nhập tên phòng!");
        return;
      }
      const response = await apiClient.post("/games/create", {
        name : roomName,
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

  const handleJoinRoom = async () => {
    if (!roomId.trim()) {
      setErrorMessage("⚠ Vui lòng nhập tên phòng!");
      return;
    }
    try {
      // Gửi request tìm phòng theo tên
      const response = await apiClient.get(`/games/find-by-room-name`, {
        params: { name: roomId.trim() },
      });
  
      const foundGame = response.data;

      if (foundGame && foundGame.id) {
        navigate(`/Lobby/game/${foundGame.id}`); // ✅ Chuyển sang phòng nếu tồn tại
      } else {
        setErrorMessage("❌ Không tìm thấy phòng hoặc phòng đã đầy!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tìm phòng:", error);
      setErrorMessage("❌ Không thể tìm phòng, thử lại sau!");
    }
  };

  const handleRandomRoom = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const username = getUsernameFromToken();
      if (!username) {
        alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!");
        setLoading(false);
        return;
      }
  
      // Gọi API để tìm phòng trống
      const response = await apiClient.get("/games/find-random-room");
      const foundRoom = response.data;
  
      if (foundRoom && foundRoom.id) {
        // Nếu tìm thấy phòng phù hợp, tham gia vào phòng đó
        setGameId(foundRoom.id);
        navigate(`/Lobby/game/${foundRoom.id}`);
        websocketService.sendJoinRequest(foundRoom.id, username);
      } else {
        // Nếu không tìm thấy phòng, tạo mới phòng
        const createResponse = await apiClient.post("/games/create", {
          gameMode: "online",
          playerBlack: username,
        });
  
        const newGameId = createResponse.data.id;
        setGameId(newGameId);
        navigate(`/Lobby/game/${newGameId}`);
        websocketService.sendJoinRequest(newGameId, username);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tìm phòng ngẫu nhiên:", error);
      setErrorMessage("❌ Không thể tìm phòng ngẫu nhiên, vui lòng thử lại sau!");
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

      <h1 
      className="text-6xl font-bold mb-10 text-[#003366] drop-shadow-lg">
        Chế độ Online
      </h1>

      <div className="flex flex-col gap-6 w-80">

      {/* tao phong */}
        <button
          onClick={openModal}
          disabled={loading}
          className="w-full py-4 bg-blue-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-blue-700 shadow-md"
        >
          {loading ? "⏳ Đang tạo phòng..." : "🏠 Tạo phòng"}
        </button>
        {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-8 rounded-xl shadow-xl w-96">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Nhập tên phòng</h2>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="🔢 Nhập tên phòng"
            className="mb-6 px-4 py-3 border border-gray-300 rounded-lg text-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md disabled:bg-gray-400"
            >
              {loading ? "Đang tạo..." : "Tạo phòng"}
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={closeModal}
              className="w-full py-2 bg-gray-500 text-white rounded-lg text-lg font-semibold transition duration-300 hover:bg-gray-600 shadow-md"
            >
              ❌ Đóng
            </button>
          </div>
        </div>
      </div>
      
      )}

         {/* 🔍 Hiện nút trước, chỉ khi bấm vào mới hiển thị ô nhập ID */}
         {!showJoinInput ? (
          <button
            onClick={() => setShowJoinInput(true)}
            className="w-full py-4 bg-green-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md"
            >
          🔍 Tìm phòng
          </button>
        ) : (
          <div className="w-full p-4 rounded-xl flex flex-col gap-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="🔢 Nhập ID phòng..."
              className="w-full px-4 py-3 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          <button
            onClick={handleJoinRoom}
            className="w-full py-4 bg-green-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md"
          >
            ✅ Vào phòng
          </button>
        <button
          onClick={() => setShowJoinInput(false)}
          className="w-full py-2 bg-gray-500 rounded-lg text-lg font-semibold transition duration-300 hover:bg-gray-600 shadow-md"
        >
          ❌ Hủy
        </button>
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
      </div>
    )}
        <button
          onClick={handleRandomRoom}
          className="w-full py-4 bg-yellow-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-yellow-700 shadow-md"
        >
          🔑 Gia nhập phòng ngẫu nhiên
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Quay lại
      </button>
    </div>
  );
};

export default Lobby;
