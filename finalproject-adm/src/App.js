import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import AuthPage from "./Pages/Home/AuthPage";
import { AdminProvider } from "./Pages/Context/adminContext";
import PrivateRoute from "./Pages/Context/PrivateRoute";
import Menu from "./Components/Menu";
import Profile from "./Components/Profile";
import UserManagement from "./Pages/Home/UserManagement";
import GameManagement from "./Pages/Home/GameManagement";


function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Trang không cần đăng nhập */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />

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
            path="/usermanagement"
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/gamemanagement"
            element={
              <PrivateRoute>
                <GameManagement />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
