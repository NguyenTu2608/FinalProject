  import React, { useState, useEffect } from "react";
  import { login } from "../../Services/authServices";
  import { useNavigate } from "react-router-dom";
  import { FaUser, FaLock, FaHome } from "react-icons/fa";

  const Login = ({ setUser }) => {
    const [username, setUsername] = useState("");
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

    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
      try {
        const response = await login(username, password);
  
        if (response && response.token) {
          localStorage.setItem("token", response.token);
          localStorage.setItem("user", JSON.stringify(response.user)); // Lưu user vào localStorage
          setUser(response.user); // Cập nhật user state
          navigate("/Home");
        } else {
          setError("Đăng nhập không thành công, vui lòng thử lại!");
        }
      } catch (err) {
        setError("Sai tên đăng nhập hoặc mật khẩu");
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
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 font-serif">Đăng Nhập</h2>
          {error && <p className="text-red-500 text-center mb-4 font-medium font-mono">{error}</p>}
          <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
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
            <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-md font-serif">
              Đăng Nhập
            </button>
          </form>
          <p className="text-center text-gray-600 text-sm mt-4 font-mono">
            Chưa có tài khoản? <a href="/register" className="text-blue-600 font-semibold hover:underline">Đăng ký</a>
          </p>
        </div>
      </div>
    );
  };

  export default Login;
