import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppBar, Box, Button, Typography, Toolbar } from '@mui/material';
import { AccountCircle, Home as HomeIcon } from '@mui/icons-material';

const NavBar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <AppBar position="static" sx={{
      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            SIGOC
          </Typography>
          <Button
            component={Link}
            to="/"
            color="inherit"
            startIcon={<HomeIcon />}
            sx={{
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Página Inicial
          </Button>
        </Box>

        {currentUser ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ 
              color: 'white',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <AccountCircle />
              {currentUser.username || 'Usuário'}
            </Typography>
            <Button
              variant="outlined"
              onClick={logout}
              sx={{
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Sair
            </Button>
          </Box>
        ) : (
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
