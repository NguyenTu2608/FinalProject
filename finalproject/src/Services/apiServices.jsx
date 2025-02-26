import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth"; // URL của backend Spring Boot

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Đăng ký tài khoản
export const register = async (username, password) => {
  try {
    const response = await api.post("/sign-up", { username, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await api.post("/sign-in", { username, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
