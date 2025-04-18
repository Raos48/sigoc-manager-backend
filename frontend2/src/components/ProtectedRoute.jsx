import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Exibir indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirecionar para a página de login se não estiver autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Renderizar o componente filho (rota protegida)
  return <Outlet />;
};

export default ProtectedRoute;
