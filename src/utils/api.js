import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-webgis-simoanginangin.vercel.app",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token-simoanginangin");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
