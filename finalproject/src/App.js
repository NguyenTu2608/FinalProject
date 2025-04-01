import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Login/Register";
import ChessBoard from "./Components/Chessboard";
import Home from "./Pages/Home/Home";
import Game from "./Pages/Game/Game";
import Lobby from "./Pages/Game/Lobby";
import Menu from "./Components/Menu";
import Training from "./Pages/Game/Training";
import Profile from "./Components/Profile";
import AuthPage from "./Pages/Home/AuthPage";
import TrainingRoom from "./Pages/Game/TrainingRoom";
import ChooseAI from "./Pages/Game/ChooseAI";
import TrainingAI from "./Pages/Game/TrainingAI";
import ChessboardAI from "./Components/ChessboardAI";
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
            path="/Training"
            element={
              <PrivateRoute>
                <Training />
              </PrivateRoute>
            }
          />
          <Route
            path="/Training/TrainingRoom"
            element={
              <PrivateRoute>
                <TrainingRoom />
              </PrivateRoute>
            }
          />
          <Route
            path="/Training/TrainingRoom/:gameId"
            element={
              <PrivateRoute>
                <TrainingRoom />
              </PrivateRoute>
            }
          />
          <Route
            path="/Training/ChooseAI"
            element={
              <PrivateRoute>
                <ChooseAI />
              </PrivateRoute>
            }
          />
          <Route
            path="/Training/ChooseAI/ChessboardAI"
            element={
              <PrivateRoute>
                <ChessboardAI />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
