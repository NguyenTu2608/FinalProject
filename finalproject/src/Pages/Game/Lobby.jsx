import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Assets/background.png')" }}
    >
      {/* Tiêu đề */}
      <h1 className="text-6xl font-bold mb-10 text-[#003366] drop-shadow-lg">Chọn chế độ chơi</h1>

      {/* Các nút lựa chọn */}
      <div className="flex flex-col gap-6 w-80">
        <button
          onClick={() => navigate("/Lobby/game")}
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
