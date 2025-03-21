import apiClient from "./apiConfig";

export const login = async (username, password) => {
  try {
    const response = await apiClient.post("/auth/sign-in", { username, password });
    if (!response.data.token) {
      throw new Error("Dữ liệu phản hồi không hợp lệ từ máy chủ.");
    }

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

