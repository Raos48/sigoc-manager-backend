// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para buscar informações do usuário
    const fetchUserInfo = async () => {
        try {
            const response = await api.get('usuarios/me/');
            setUserInfo(response.data);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
            return null;
        }
    };

    // Atualiza os headers de autorização
    const updateAxiosHeaders = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    };

    // Carrega o usuário ao inicializar
    useEffect(() => {
        const loadUser = async () => {
            const storedUser = authService.getCurrentUser();
            if (storedUser) {
                setCurrentUser(storedUser);
                updateAxiosHeaders(storedUser.access);

                // Tenta buscar informações adicionais do usuário
                try {
                    await fetchUserInfo();
                } catch (error) {
                    console.log('Não foi possível buscar dados do usuário', error);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Função de login
    const login = async (email, password) => {
        const userData = await authService.login(email, password);
        setCurrentUser(userData);
        updateAxiosHeaders(userData.access);
        await fetchUserInfo();
        return userData;
    };

    // Função de logout
    const logout = () => {
        authService.logout();
        setCurrentUser(null);
        setUserInfo(null);
    };

    const value = {
        currentUser,
        userInfo,
        isAuthenticated: !!currentUser,
        login,
        logout,
        loading,
        fetchUserInfo
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
