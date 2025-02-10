import React from "react";
import Navbar from "../../Components/Navbar"; // Import Navbar
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar /> {/* Gọi Navbar ở đầu trang */}

      <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-5xl font-bold text-red-600 mb-6 drop-shadow-md">Cờ Tướng Online</h1>

        <div className="flex space-x-4">
          <Link to="/game" className="px-6 py-3 bg-green-500 text-white text-xl rounded-lg shadow-md hover:bg-green-600 transition">
            🎮 Chơi Ngay
          </Link>
          <Link to="/leaderboard" className="px-6 py-3 bg-blue-500 text-white text-xl rounded-lg shadow-md hover:bg-blue-600 transition">
            🏆 Xếp Hạng
          </Link>
        </div>

        <img src="/assets/chessboard.png" alt="Bàn Cờ Tướng" className="mt-8 w-96 rounded-lg shadow-lg" />
      </div>
    </div>
  );
};

export default Home;
