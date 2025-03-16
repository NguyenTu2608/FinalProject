import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Kiểm tra token

  if (!token) {
    return <Navigate to="/login" replace />; // Nếu không có token, chuyển về trang Login
  }

  return children;
};

export default PrivateRoute;
