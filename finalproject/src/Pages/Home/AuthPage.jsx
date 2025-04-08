import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/Home");
    }
  }, [navigate]);

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
      <div className="flex justify-center items-center h-[85vh]">
        <div className="grid grid-cols-2 gap-48 mt-24">
          {/* Đăng nhập */}
          <button onClick={() => navigate("/login")} className="relative group">
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
          <button onClick={() => navigate("/register")} className="relative group">
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
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
