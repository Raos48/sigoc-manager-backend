// src/services/authService.js
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Alterar URLs absolutos para URLs relativos
const API_URL = '/api/token/';  // Mudando de 'http://127.0.0.1:8000/api/token/' para '/api/token/'

const authService = {
    login: async (email, password) => {
        // Remova qualquer header de Authorization existente
        delete axios.defaults.headers.common['Authorization'];
        try {
            const response = await axios.post(API_URL, { email, password });
            if (response.data.access) {
                // Armazene TODOS os tokens
                const userData = {
                    access: response.data.access,
                    refresh: response.data.refresh
                };
                try {
                    const decodedToken = jwtDecode(response.data.access);
                    userData.userId = decodedToken.user_id;
                    userData.email = decodedToken.email;
                    // Armazene mais dados do token se necessário
                } catch (e) {
                    console.error('Erro ao decodificar token:', e);
                }
                localStorage.setItem('user', JSON.stringify(userData));
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            }
            return response.data;
        } catch (error) {
            console.error('Erro de login:', error.response?.data || error.message);
            throw error; // Propague o erro para ser tratado pelo componente
        }
    },
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return null;
            const user = JSON.parse(userStr);
            // Verifique se o token ainda é válido (não expirou)
            // Isso é uma verificação básica - tokens inválidos realmente deveriam ser verificados no servidor
            try {
                const decoded = jwtDecode(user.access);
                const currentTime = Date.now() / 1000;
                if (decoded.exp && decoded.exp < currentTime) {
                    // Token expirou, remova-o
                    authService.logout();
                    return null;
                }
            } catch (e) {
                console.error('Erro ao verificar expiração do token:', e);
                return null;
            }
            return user;
        } catch (error) {
            console.error('Erro ao recuperar usuário atual:', error);
            return null;
        }
    },
    logout: () => {
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    },
    refreshToken: async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.refresh) {
                throw new Error('No refresh token available');
            }
            // Alterar URL absoluto para URL relativo
            const response = await axios.post('/api/token/refresh/', {
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
        } catch (error) {
            console.error('Erro ao atualizar token:', error.response?.data || error.message);
            // Se o refresh token for inválido, faça logout
            if (error.response?.status === 401) {
                authService.logout();
            }
            throw error;
        }
    },
    // Função para extrair informações de um token JWT
    decodeToken: (token) => {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return {};
        }
    },
    // Método auxiliar para verificar se o token atual está expirado
    isTokenExpired: () => {
        const user = authService.getCurrentUser();
        if (!user?.access) return true;
        try {
            const decoded = jwtDecode(user.access);
            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch (e) {
            console.error('Erro ao verificar expiração do token:', e);
            return true;
        }
    }
};

export default authService;
