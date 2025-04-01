import { useNavigate } from "react-router-dom";
import Profile from "../../Components/Profile";

export default function ChooseAI() {
  const navigate = useNavigate();

  // Hàm chuyển hướng đến trang TrainingAI với chế độ đã chọn
  const handleModeSelect = (mode) => {
    navigate(`/Training/ChooseAI/ChessBoardAI`);
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
        onClick={() => handleModeSelect()} // Chế độ Dễ
        className="w-full py-4 bg-green-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-green-700 shadow-md"
      >
        Dễ
      </button>
      <button
        onClick={() => handleModeSelect('medium')} // Chế độ Khó
        className="w-full py-4 bg-yellow-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-yellow-700 shadow-md"
      >
        Khó
      </button>
      <button
        onClick={() => handleModeSelect('hard')} // Chế độ Siêu Khó
        className="w-full py-4 bg-red-600 rounded-lg text-xl font-semibold transition duration-300 hover:bg-red-700 shadow-md"
      >
        Siêu Khó
      </button>
      </div>
      <button
        onClick={() => navigate("/")} // Quay lại trang trước
        className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
      >
        ⬅ Quay lại
      </button>
    </div>
  );
}
