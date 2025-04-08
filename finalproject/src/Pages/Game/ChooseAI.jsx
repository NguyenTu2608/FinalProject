import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../Components/Profile";

export default function ChooseAI() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);

  // Khi chọn mức độ AI, mở popup chọn màu quân
  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
  };

  // Khi chọn màu quân, điều hướng sang trang chơi cờ
  const handleColorSelect = (color) => {
    navigate(`/Training/ChooseAI/ChessBoardAI?mode=${selectedMode}&color=${color}`);
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
          onClick={() => handleModeSelect("easy")}
          className="w-full py-4 bg-green-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md"
        >
          Dễ
        </button>
        <button
          onClick={() => handleModeSelect("medium")}
          className="w-full py-4 bg-yellow-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-yellow-700 shadow-md"
        >
          Khó
        </button>
        <button
          onClick={() => handleModeSelect("hard")}
          className="w-full py-4 bg-red-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-red-700 shadow-md"
        >
          Siêu Khó
        </button>
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Quay lại
      </button>

      {/* Popup chọn màu quân cờ */}
      {selectedMode && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-96 border border-gray-300">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Chọn màu quân cờ</h2>
            <p className="text-gray-600 mb-6 text-lg">Hãy chọn màu quân cờ bạn muốn chơi</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleColorSelect("black")}
                className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl text-2xl font-semibold border-4 border-transparent hover:border-gray-600 hover:scale-105 transition duration-300 shadow-lg"
              >
                ♟️ Đen
              </button>
              <button
                onClick={() => handleColorSelect("red")}
                className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl text-2xl font-semibold border-4 border-transparent hover:border-red-400 hover:scale-105 transition duration-300 shadow-lg"
              >
                ♟️ Đỏ
              </button>
            </div>
            <button
              onClick={() => setSelectedMode(null)}
              className="mt-6 text-gray-500 text-lg hover:text-gray-700 transition"
            >
              ❌ Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
