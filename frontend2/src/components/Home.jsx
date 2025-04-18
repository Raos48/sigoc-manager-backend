import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    // Buscar informações do usuário após login bem-sucedido
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('http://localhost:8000/api/usuarios/usuarios/');
          
          // Supondo que o primeiro usuário é o logado, já que a API retorna uma lista
          const user = response.data.results[0];
          
          // Use first_name se disponível, caso contrário extraia do nome_completo
          const firstName = user.first_name || user.nome_completo.split(' ')[0];
          
          setUserName(firstName || 'Usuário');
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    // Remover token do localStorage
    localStorage.removeItem('accessToken');
    // Remover token do cabeçalho padrão
    delete axios.defaults.headers.common['Authorization'];
    // Atualizar contexto de autenticação
    logout();
    // Redirecionar para a página de login
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestão
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Bem-vindo, {userName}!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Você está logado com sucesso no sistema.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
