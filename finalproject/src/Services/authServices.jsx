import apiClient from "./apiConfig";

// Đăng nhập
export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/auth/sign-in", { username, password });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || "Đăng nhập thất bại");
    } else {
      throw new Error("Không thể kết nối đến máy chủ, vui lòng thử lại sau.");
    }
  }
};

// Đăng ký tài khoản
export const register = async (username, password, email) => {
  try {
    const response = await apiClient.post("/auth/sign-up", { username, password, email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data || "Đăng ký thất bại");
    } else {
      throw new Error("Không thể kết nối đến máy chủ, vui lòng thử lại sau.");
    }
  }
};

