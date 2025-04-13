// src/components/Layout/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 3, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="textSecondary" align="center">
                © {new Date().getFullYear()} SIGOC - Sistema Integrado de Gestão de Órgãos de Controle
            </Typography>
        </Box>
    );
};

export default Footer; // Exportação padrão