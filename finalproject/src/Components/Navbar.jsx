import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold">Cờ Tướng Online</h1>

        {/* Menu */}
        <div className="space-x-6">
          <Link to="/" className="hover:text-gray-300">🏠 Trang Chủ</Link>
          <Link to="/game" className="hover:text-gray-300">🎮 Chơi Ngay</Link>
          <Link to="/leaderboard" className="hover:text-gray-300">🏆 Xếp Hạng</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
