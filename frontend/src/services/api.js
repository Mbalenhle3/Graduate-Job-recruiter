import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("graduatelink-access-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiError(error) {
  const detail = error.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(". ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (!error.response) {
    return "The backend could not be reached. Make sure FastAPI is running.";
  }

  return "Something went wrong. Please try again.";
}

export default api;
