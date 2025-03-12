import { Navigate } from "react-router-dom";
import { useUser } from "./userContext";

const PrivateRoute = ({ children }) => {
  const { user } = useUser(); // Lấy user từ context
  const token = localStorage.getItem("token"); // Hoặc kiểm tra token nếu cần

  if (!user && !token) {
    return <Navigate to="/login" replace />; // Chưa đăng nhập thì chuyển về trang Login
  }

  return children;
};

export default PrivateRoute;
