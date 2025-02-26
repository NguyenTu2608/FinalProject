import React, { useState } from "react";
import { register  } from "../../Services/apiServices";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login"); // Chuyển sang trang đăng nhập
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">Đăng Ký</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form className="w-80 flex flex-col space-y-4" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Đăng Ký
        </button>
      </form>
    </div>
  );
};

export default Register;
