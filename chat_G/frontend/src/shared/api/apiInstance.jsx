import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiinstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token for cross-origin deployments (cookie is used same-origin)
apiinstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("chatg_token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});