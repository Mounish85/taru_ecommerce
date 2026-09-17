import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/taru",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message extraction
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      error.customMessage = serverMessage;
    } else if (error.request && !error.response) {
      error.customMessage = "Unable to connect to the Taru server. Please check your network or server status.";
    } else {
      error.customMessage = error.message || "An unexpected error occurred.";
    }
    return Promise.reject(error);
  }
);

export default api;

