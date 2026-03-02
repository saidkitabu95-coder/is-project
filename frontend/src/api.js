import axios from "axios";

const DEFAULT_API_BASE = import.meta.env.DEV
  ? "http://127.0.0.1:8080/api"
  : "https://is-project2.onrender.com/api";

const API_BASE = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response.status === 401;
    const alreadyRetried = originalRequest._retry;
    const isRefreshRequest = originalRequest.url?.includes("/token/refresh/");

    if (!isUnauthorized || alreadyRetried || isRefreshRequest) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axios.post(`${API_BASE}/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = res.data.access;
      localStorage.setItem("access_token", newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("username");
      window.location.href = "/login";
      return Promise.reject(refreshError);
    }
  }
);

export default api;
