import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {/* Tiêu đề */}
      <h1 className="text-4xl font-bold mb-10 text-yellow-400">Chọn chế độ chơi</h1>
      
      {/* Các nút lựa chọn */}
      <div className="flex flex-col gap-6 w-80">
        <button
          onClick={() => navigate("/Lobby/tao-phong")}
          className="w-full py-4 bg-blue-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-blue-700 shadow-md"
        >
          🏠 Tạo phòng
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
          🔑 Gia nhập phòng
        </button>
      </div>
    </div>
  );
};

export default Lobby;
