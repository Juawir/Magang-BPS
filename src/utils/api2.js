import axios from "axios";

const api2 = axios.create({
  baseURL: "https://backend-webgis-simoketawang.vercel.app/",
});

// Add a request interceptor
api2.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token-simoketawang");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api2;
