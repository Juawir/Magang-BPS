import axios from "axios";

const api5 = axios.create({
  baseURL: "https://backend-desa-cantik-sda.vercel.app",
});

// Add a request interceptor
api5.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token-desa-cantik");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api5;
