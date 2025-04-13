// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Adicione esta importação

const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    if (isLoading) {
        return <div>Carregando...</div>;
    }
    
    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;