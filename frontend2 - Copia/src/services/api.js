import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Removido o /v1/
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user && user.access) {
      config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await authService.refreshToken();
        const { access } = refreshResponse;
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
