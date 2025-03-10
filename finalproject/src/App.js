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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Cập nhật user từ localStorage khi load lại trang
    }
  }, []);
  return (
    <Router>
      {user && <Menu user={user} />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/chessboard" element={<ChessBoard />} />
        <Route path="/Lobby" element={<Lobby />} />
        <Route path="/Lobby/game" element={<Game />} />
        <Route path="/Menu" element={<Menu />} />
        <Route path="/Pratice" element={<Pratice />} />
        
      </Routes>
    </Router>
  );
}

export default App;
