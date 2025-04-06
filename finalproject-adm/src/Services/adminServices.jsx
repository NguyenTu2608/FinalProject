import apiClient from "./apiConfig";

// Lấy thông tin user từ token
export const getCurrentAdmin = async () => {
  const response = await apiClient.get("/admins/me");
  return response.data;
};