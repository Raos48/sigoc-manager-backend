import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
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
  
  // Dados fictícios para os cards
  const dashboardData = {
    processosPendentes: 45,
    processosVencidos: 12,
    tempoMedioConclusao: '15 dias',
    processosNoPrazo: 89,
    taxaConclusao: 78,
    processosUrgentes: 8,
  };

  // Função para formatar números grandes
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#4285f4' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Gestão
          </Typography>
          <Tooltip title="Atualizar dados">
            <IconButton color="inherit" size="large">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button color="inherit" onClick={handleLogout}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bem-vindo, {userName}!
        </Typography>
        
        {/* Grid de cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Card de Processos Pendentes */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#4285f4',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ fontSize: 40, color: '#4285f4', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    {formatNumber(dashboardData.processosPendentes)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Processos Pendentes
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card de Processos Vencidos */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#d32f2f',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ fontSize: 40, color: '#d32f2f', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    {formatNumber(dashboardData.processosVencidos)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Processos Vencidos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Card de Tempo Médio */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#2e7d32',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimerIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    {dashboardData.tempoMedioConclusao}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tempo Médio de Conclusão
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          

          {/* Card de Processos no Prazo */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#4285f4',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#4285f4', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    {formatNumber(dashboardData.processosNoPrazo)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Processos no Prazo
                </Typography>
                <Box sx={{ mt: 2, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: '#4285f4',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card de Taxa de Conclusão */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#2e7d32',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    {dashboardData.taxaConclusao}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Taxa de Conclusão
                </Typography>
                <Box sx={{ mt: 2, width: '100%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={dashboardData.taxaConclusao}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 5,
                        backgroundColor: '#2e7d32',
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card de Processos Urgentes */}
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#ed6c02',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon sx={{ fontSize: 40, color: '#ed6c02', mr: 2 }} />
                  <Typography variant="h5" component="div">
                    {formatNumber(dashboardData.processosUrgentes)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Processos Urgentes
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Conteúdo original */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body1">
              Você está logado com sucesso no sistema.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Home;
