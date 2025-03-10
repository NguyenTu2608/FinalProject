import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth"; // URL của backend Spring Boot

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await api.post("/sign-in", { username, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Nếu backend trả về lỗi cụ thể
      throw new Error(error.response.data || "Đăng nhập thất bại");
    } else {
      // Nếu lỗi không đến từ backend (ví dụ: lỗi mạng)
      throw new Error("Không thể kết nối đến máy chủ, vui lòng thử lại sau.");
    }
  }
};



// Đăng ký tài khoản
export const register = async (username, password, email) => {
  try {
    const response = await api.post("/sign-up", { username, password, email });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Nếu backend trả về lỗi cụ thể
      throw new Error(error.response.data || "Đăng ký thất bại");
    } else {
      // Nếu lỗi không đến từ backend (ví dụ: lỗi mạng)
      throw new Error("Không thể kết nối đến máy chủ, vui lòng thử lại sau.");
    }
  }
};