// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAccessToken, login as authLogin, logout as authLogout } from '../services/auth';
import { decodeToken, isTokenExpired } from '../utils/jwt';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = getAccessToken();
            
            if (token) {
                try {
                    // Verifica se o token está expirado
                    if (isTokenExpired(token)) {
                        authLogout();
                        return;
                    }
                    
                    const decoded = decodeToken(token);
                    setUser(decoded);
                } catch (error) {
                    console.error('Token inválido:', error);
                    authLogout();
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, []);

    const login = async (username, password) => {
        try {
            const success = await authLogin(username, password);
            
            if (success) {
                const token = getAccessToken();
                const decoded = decodeToken(token);
                setUser(decoded);
            }
            return success;
        } catch (error) {
            console.error('Erro no login:', error);
            return false;
        }
    };

    const logout = () => {
        authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);