import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    
    // Mostrar loading enquanto verifica a autenticação
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }
    
    // Redirecionar para login se não estiver autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Renderizar as rotas filhas se estiver autenticado
    return <Outlet />;
};

export default ProtectedRoute;
