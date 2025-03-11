import React, { useState, useEffect } from "react";
import { register } from "../../Services/authServices";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaHome } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          // Nếu đã đăng nhập, chuyển hướng về trang chính
          navigate("/Home");
        }
      }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, email);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      setError("Tên đăng nhập hoặc email đã tồn tại hoặc có lỗi xảy ra.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('../public/Assets/background.png')" }}>
      <button 
        className="absolute top-5 left-5 flex items-center text-[#D81B60] text-lg font-semibold hover:text-[#B71C1C] transition"
        onClick={() => navigate("/")}
      >
        <FaHome className="mr-2" /> Trang chủ
      </button>
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 transform transition duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif">Đăng Ký</h2>
        {error && <p className="text-red-500 text-center mb-4 font-medium font-mono">{error}</p>}
        <form className="flex flex-col space-y-4" onSubmit={handleRegister}>
          <div className="flex items-center border rounded-lg p-3 bg-gray-50 shadow-sm hover:shadow-md transition">
            <FaUser className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 font-sans"
            />
          </div>
          <div className="flex items-center border rounded-lg p-3 bg-gray-50 shadow-sm hover:shadow-md transition">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 font-sans"
            />
          </div>
          <div className="flex items-center border rounded-lg p-3 bg-gray-50 shadow-sm hover:shadow-md transition">
            <FaEnvelope className="text-gray-500 mr-3" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 font-sans"
            />
          </div>
          
          <button type="submit" className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md font-serif">
            Đăng Ký
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-4 font-mono">
          Đã có tài khoản? <a href="/login" className="text-green-600 font-semibold hover:underline">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
