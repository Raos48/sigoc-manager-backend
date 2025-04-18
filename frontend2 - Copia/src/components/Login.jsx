import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import authService from '../services/authService';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Divider,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
  styled,
} from '@mui/material';
import {
  AccountCircle,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
  Copyright as CopyrightIcon,
} from '@mui/icons-material';

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.login(username, password);
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        position: 'relative',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '400px',
          width: '90%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cabeçalho */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          }}
        />
        <SecurityIcon
          sx={{
            fontSize: 40,
            color: '#1976d2',
            mb: 2,
          }}
        />
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle sx={{ color: error ? 'error.main' : 'action.active' }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            error={!!error}
            helperText={error}
            name="password"
            placeholder="••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: error ? 'error.main' : 'action.active' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            sx={{
              mt: 2,
              mb: 2,
              position: 'relative',
              height: '44px',
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                  color: 'white',
                }}
              />
            ) : (
              'Entrar'
            )}
          </Button>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            Esqueceu sua senha?
            <Link
              href="#"
              sx={{
                ml: 1,
                color: '#1976d2',
                '&:hover': {
                  color: '#1565c0',
                },
              }}
            >
              Clique aqui
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Rodapé */}
      <Box
        sx={{
          mt: 4,
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CopyrightIcon fontSize="small" />
          {new Date().getFullYear()} SIGOC - Sistema Integrado de Gestão de Órgãos de Controle
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center">
          Desenvolvido pela equipe COADC
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
