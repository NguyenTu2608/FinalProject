import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Login/Register";
import ChessBoard from "./Components/Chessboard";
import Home from "./Pages/Home/Home";
import Game from "./Pages/Game/Game";
import Lobby from "./Pages/Game/Lobby";
import Menu from "./Components/Menu";
import Pratice from "./Pages/Game/Pratice";
import Profile from "./Components/Profile";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Cập nhật user từ localStorage khi load lại trang
      } catch (error) {
        console.error("Lỗi khi parse JSON:", error);
        setUser(null);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/chessboard" element={<ChessBoard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/lobby/game" element={<Game />} />
        <Route path="/menu" element={<Menu user={user} />} />
        <Route path="/profile" element={<Profile user={user} />} />
        <Route path="/pratice" element={<Pratice />} />
      </Routes>
    </Router>
  );
}

export default App;
