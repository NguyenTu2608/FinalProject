import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "../../Components/Menu";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
  const navigate = useNavigate(); // Hook điều hướng

  // Hàm xử lý đăng nhập giả lập (bạn có thể thay bằng API thực tế)
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token khi đăng xuất
    setIsLoggedIn(false);
    navigate("/Login");
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
      <Menu />
      <div className="flex justify-center items-center h-[85vh]">
        <div className="grid grid-cols-2 gap-48 mt-24">
          {isLoggedIn ? (
            <>
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
              <button onClick={() => navigate("/Practice")} className="relative group">
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
            </>
          ) : (
            <>
              {/* Đăng nhập */}
              <button onClick={() => navigate("/Login")} className="relative group">
                <img
                  src="/Assets/iconlogin.png"
                  alt="Đăng nhập"
                  className="w-80 h-80 rounded-full object-cover transform transition duration-300 group-hover:scale-110"
                />
                <span 
                  className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 text-2xl font-bold text-yellow-500"
                  style={{ fontFamily: '"Noto Serif TC", serif' }}
                >
                  Đăng nhập
                </span>
              </button>

              {/* Đăng ký */}
              <button onClick={() => navigate("/Register")} className="relative group">
                <img
                  src="/Assets/register1.png"
                  alt="Đăng ký"
                  className="w-80 h-80 rounded-full object-cover transform transition duration-300 group-hover:scale-110"
                />
                <span 
                  className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 text-2xl font-bold text-yellow-500"
                  style={{ fontFamily: '"Noto Serif TC", serif' }}
                >
                  Đăng ký
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Đăng xuất */}
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
    </div>
  );
};

export default Home;
