import React, { useState } from "react";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const [showLoginModal, setShowLoginModal] = useState(false); // Trạng thái hiển thị modal

  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    setIsLoggedIn(true); // Chuyển sang trạng thái đã đăng nhập
    setShowLoginModal(false); // Đóng modal
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false); // Chuyển về trạng thái chưa đăng nhập
  };

  return (
    <div className="bg-gray-800 min-h-screen text-white relative">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        {/* Hiển thị thông tin người dùng hoặc nút Đăng nhập */}
        {!isLoggedIn ? (
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Đăng nhập
          </button>
        ) : (
          <div className="flex items-center">
            <div className="rounded-full bg-red-500 w-12 h-12 flex items-center justify-center">
              <span className="font-bold text-xl">Tập</span>
            </div>
            <div className="ml-4">
              <div className="font-bold">73BCC7D225...</div>
              <div className="text-sm">Tập sự</div>
              <div className="text-sm mt-1 text-yellow-300">ELO: 1200</div>
            </div>
          </div>
        )}

        {/* Nhóm nút chuyển sang góc phải trên */}
        <div className="flex space-x-4">
          <button className="bg-gray-600 px-4 py-2 rounded">Lịch sử</button>
          <button className="bg-gray-600 px-4 py-2 rounded">Xếp hạng</button>
          <button className="bg-gray-600 px-4 py-2 rounded">Bạn bè</button>
        </div>
      </div>

      {/* VS Section */}
      <div className="flex flex-col items-center mt-8">
        <div className="flex items-center">
          {/* Player 1 */}
          <div className="text-center">
            <div className="bg-red-500 w-16 h-16 rounded-full mx-auto"></div>
            <div>Tập sự</div>
          </div>
          <div className="mx-4 text-2xl">VS</div>
          {/* Player 2 */}
          <div className="text-center">
            <div className="bg-blue-500 w-16 h-16 rounded-full mx-auto"></div>
            <div>Kỳ thủ</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div>AD195D1... (2)</div>
          <div>711CCD...</div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="grid grid-cols-3 gap-6 mt-12 px-4">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Cờ Úp"
            className="mx-auto"
          />
          <div className="mt-2">Cờ Úp</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Cờ Tướng"
            className="mx-auto"
          />
          <div className="mt-2">Cờ Tướng</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Luyện Tập"
            className="mx-auto"
          />
          <div className="mt-2">Luyện Tập</div>
        </div>
      </div>

      {/* Nút Đăng xuất ở góc phải dưới */}
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
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Tên đăng nhập</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Mật khẩu</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
