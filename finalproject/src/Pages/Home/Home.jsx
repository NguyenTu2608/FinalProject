import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../Components/Menu";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate(); // Hook điều hướng

  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/Assets/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        {!isLoggedIn ? (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Đăng nhập
          </button>
        ) : (
          <Menu />
        )}

        {/* Nhóm nút góc phải */}
        <div className="flex space-x-4">
          
        </div>
      </div>

      {/* Main Menu (Căn giữa) */}
      <div className="flex justify-center items-center h-[85vh]">
  <div className="grid grid-cols-2 gap-48 mt-20">
    {/* Cờ Tướng */}
    <button onClick={() => navigate("/Lobby")} className="relative group">
      <img
        src="/Assets/iconcotuong1.png" 
        alt="Cờ Tướng"
        className="w-80 h-80 rounded-full object-cover transform transition duration-300 group-hover:scale-110"
      />
      <span 
        className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 text-3xl font-bold text-yellow-500"
        style={{ fontFamily: '"Noto Serif TC", serif' }}
      >
        Cờ Tướng
      </span>
    </button>

    {/* Luyện Tập */}
    <button onClick={() => navigate("/Pratice")} className="relative group">
      <img
        src="/Assets/iconcotuong2.png"
        alt="Luyện Tập"
        className="w-80 h-80 rounded-full object-cover transform transition duration-300 group-hover:scale-110"
      />
      <span 
        className="absolute bottom-[-40px] left-1/2 transform -translate-x-1/2 text-3xl font-bold text-yellow-500"
        style={{ fontFamily: '"Noto Serif TC", serif' }}
      >
        Luyện tập
      </span>
    </button>
  </div>
</div>

      {/* Nút Đăng xuất */}
      {isLoggedIn && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Tên đăng nhập</label>
                <input
                  type="text"
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Mật khẩu</label>
                <input
                  type="password"
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
