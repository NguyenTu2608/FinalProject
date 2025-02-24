import React from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng React Router để chuyển trang

const GameModeSelection = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="grid grid-cols-2 gap-16">
        {/* Nút Cờ Tướng */}
        <button
          onClick={() => navigate("/co-tuong")}
          className="relative group"
        >
          <img
            src="/Assets/co-tuong.png" // Đường dẫn hình ảnh
            alt="Cờ Tướng"
            className="w-48 h-48 transform transition duration-300 group-hover:scale-110"
          />
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-2xl font-bold text-yellow-500">
            Cờ Tướng
          </span>
        </button>

        {/* Nút Luyện Tập */}
        <button
          onClick={() => navigate("/luyen-tap")}
          className="relative group"
        >
          <img
            src="/Assets/luyen-tap.png"
            alt="Luyện Tập"
            className="w-48 h-48 transform transition duration-300 group-hover:scale-110"
          />
          <span className="absolute bottom-[-30px] left-1/2 transform -translate-x-1/2 text-2xl font-bold text-yellow-500">
            Luyện tập
          </span>
        </button>
      </div>
    </div>
  );
};

export default GameModeSelection;
