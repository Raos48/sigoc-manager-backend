import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  styled
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
//import axios from 'axios';
import { useAuth } from '../contexts/useAuth';
import authService from '../services/authService'; // Ajuste o caminho conforme necessário

const Card = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(3),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '400px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Box)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  background: 'linear-gradient(to bottom, #f0f4f8, #ffffff)',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundRepeat: 'no-repeat',
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Em vez de fazer a requisição diretamente, delegar para o authService
      const userData = await authService.login(username, password);
      
      // Passa apenas o access token para o contexto de autenticação
      login(userData.access);
      
      navigate('/');
    } catch (err) {
      console.error('Erro no login:', err.response?.data || err.message);
      setError('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Title
          component="h1"
          variant="h5"
          sx={{ width: '100%', fontSize: 'clamp(1.5rem, 8vw, 1.75rem)' }}
        >
          SIGOC - Sistema Integrado de Gestão de Orgãos de Controle
        </Title>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <TextField
            error={!!error}
            helperText={error}
            id="username"
            name="username"
            placeholder="Seu nome de usuário"
            autoComplete="username"
            autoFocus
            required
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            error={!!error}
            helperText={error}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                value="remember"
                color="primary"
              />
            }
            label="Lembrar senha"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default Login;
