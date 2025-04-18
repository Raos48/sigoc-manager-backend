import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000/api/token/';

// authService.js
const authService = {
  login: async (username, password) => {
    // Remova qualquer header de Authorization existente
    delete axios.defaults.headers.common['Authorization'];
    
    const response = await axios.post(API_URL, { username, password });
    
    if (response.data.access) {
      // Armazene TODOS os tokens
      const userData = {
        access: response.data.access,
        refresh: response.data.refresh // Adicione se houver refresh token
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Configure o cabeçalho de autorização
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    
    return response.data;
  },
  
  // Função para obter o usuário atual do localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  // Função de logout
  logout: () => {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },
  
  // Adicione a função para renovar o token
  refreshToken: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.refresh) {
      throw new Error('No refresh token available');
    }
    
    const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
      refresh: user.refresh
    });
    
    if (response.data.access) {
      // Atualize apenas o token de acesso
      user.access = response.data.access;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Atualize o cabeçalho de autorização
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    
    return response.data;
  }
};

export default authService;
