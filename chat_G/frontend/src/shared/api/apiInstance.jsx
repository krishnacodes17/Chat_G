import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiinstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});