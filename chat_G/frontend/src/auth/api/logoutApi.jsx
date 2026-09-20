import { apiinstance } from "../../shared/api/apiInstance"



export const logoutApi = async () => {
  try {
    const response = await apiinstance.post("/auth/logout");

    console.log("Logout API response:", response.data);

    return response.data;
  } catch (error) {
    console.log("Logout API error:", error);
    console.log("Logout API error response:", error.response?.data);

    throw error;
  }
};