import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Login/Register";
import ChessBoard from "./Components/Chessboard";
import Home from "./Pages/Home/Home";
import Game from "./Pages/Game/Game";
import Lobby from "./Pages/Game/Lobby";
import Menu from "./Components/Menu";
import Practice from "./Pages/Game/Practice";
import Profile from "./Components/Profile";
import AuthPage from "./Pages/Home/AuthPage";
import PracticeRoom from "./Pages/Game/PracticeRoom";
import { UserProvider } from "./Pages/Context/userContext";
import PrivateRoute from "./Pages/Context/PrivateRoute"; // Import PrivateRoute

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Trang không cần đăng nhập */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Trang cần đăng nhập */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/game"
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            }
          />
          <Route
            path="/chessboard"
            element={
              <PrivateRoute>
                <ChessBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/lobby"
            element={
              <PrivateRoute>
                <Lobby />
              </PrivateRoute>
            }
          />
          <Route
            path="/lobby/game/:gameId"
            element={
              <PrivateRoute>
                <Game />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute>
                <Menu />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <PrivateRoute>
                <Practice />
              </PrivateRoute>
            }
          />
          <Route
            path="/practice/practiceRoom"
            element={
              <PrivateRoute>
                <PracticeRoom />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
