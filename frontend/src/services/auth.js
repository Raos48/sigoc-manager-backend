import axios from 'axios';

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');

export const setTokens = (access, refresh) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
};

export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:8000/api/token/', {
            username,
            password
        });
        
        if (response.data.access && response.data.refresh) {
            setTokens(response.data.access, response.data.refresh);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro no login:', error);
        return false;
    }
};

export const logout = () => {
    clearTokens();
};