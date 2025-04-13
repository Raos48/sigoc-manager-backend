// services/api.js
import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens } from "./auth";
import { jwtDecode } from "jwt-decode"; // Importação corrigida

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token às requisições
api.interceptors.request.use(async (config) => {
  const token = getAccessToken();

  if (token) {
    const decoded = jwtDecode(token); // Uso direto da função
    if (decoded.exp * 1000 < Date.now()) {
      try {
        const newToken = await refreshAuthToken();
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      } catch (error) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAuthToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function refreshAuthToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  // Removi o try/catch redundante
  const response = await axios.post(
    "http://localhost:8000/api/v1/auth/token/refresh/",
    { refresh: refreshToken }
  );

  const { access, refresh } = response.data;
  setTokens(access, refresh);
  return access;
}

export default api;