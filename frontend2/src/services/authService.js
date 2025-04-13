import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/auth/';

const authService = {
  login: async (username, password) => {
    const response = await axios.post(API_URL + 'token/', {
      username,
      password
    });
    if (response.data.access) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
  refreshToken: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.refresh) {
      return Promise.reject('Nenhum token de atualização disponível');
    }
    try {
      const response = await axios.post(API_URL + 'token/refresh/', {
        refresh: user.refresh
      });
      const updatedUser = {
        ...user,
        access: response.data.access
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return response.data;
    } catch (error) {
      authService.logout();
      return Promise.reject(error);
    }
  },
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;