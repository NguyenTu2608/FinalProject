import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import ChessBoard from "./Components/Chessboard";
import Home from "./Pages/Home/Home";
import Game from "./Pages/Game/Game";
import Lobby from "./Pages/Game/Lobby";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="/chessboard" element={<ChessBoard />} />
        <Route path="/Lobby" element={<Lobby />} />
        
      </Routes>
    </Router>
  );
}

export default App;
