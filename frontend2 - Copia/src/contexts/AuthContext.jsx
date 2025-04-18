import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios'; // Adicione esta importação
import api from '../services/api'; // Adicione esta importação (ajuste o caminho conforme necessário)
import authService from '../services/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Adicione esta função para forçar a atualização dos headers
  const updateAxiosHeaders = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Atualize o useEffect para configurar os headers
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    if (storedUser?.access) {
      updateAxiosHeaders(storedUser.access);
    }
  }, [user]);

  const login = async (accessToken) => {
    const userData = { access: accessToken }; // Mantenha apenas o token
    setUser(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
