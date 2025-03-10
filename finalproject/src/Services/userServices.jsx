import apiClient from "./apiConfig";

// Lấy thông tin user từ token
export const getCurrentUser = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};