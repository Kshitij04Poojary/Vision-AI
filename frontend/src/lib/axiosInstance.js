import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  withCredentials: true, // ✅ Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor (Attach Token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (Handle Errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized! Redirecting to login...");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;