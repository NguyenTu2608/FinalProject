import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../Components/Profile";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Nếu đã đăng nhập, chuyển hướng về trang chính
      setIsLoggedIn(!!token);
    }
    else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    setIsLoggedIn(false);
    navigate("/");
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
      <div className="absolute top-0 left-0 w-full p-4">
        <Profile />
      </div>
      <div className="flex justify-center items-center h-[85vh] relative z-10">
        <div className="grid grid-cols-2 gap-48 mt-24">
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
          <button onClick={() => navigate("/Training")} className="relative group">
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


      {/* Đăng xuất */}
      <div>
        <button
          onClick={handleLogout}
          className="absolute bottom-5 left-5 px-6 py-3 bg-red-500 rounded-full text-lg font-semibold hover:bg-red-700 transition"
        >
          ⬅ Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Home;
