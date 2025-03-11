import { useNavigate } from "react-router-dom";

const Pratice = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Assets/background.png')" }}
    >
      {/* Tiêu đề */}
      <h1 className="text-6xl font-bold mb-10 text-[#8B0000] drop-shadow-lg">Chế độ Luyện Tập</h1>
      
      {/* Các nút lựa chọn */}
      <div className="flex flex-col gap-6 w-80">
        <button
          onClick={() => navigate("/Practice/practiceRoom")}
          className="w-full py-4 bg-blue-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-blue-700 shadow-md"
        >
          🏠 Hai người chời
        </button>

        <button
          onClick={() => navigate("/Practice/tim-phong")}
          className="w-full py-4 bg-green-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md"
        >
          🔍 Chơi với máy
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

export default Pratice;
