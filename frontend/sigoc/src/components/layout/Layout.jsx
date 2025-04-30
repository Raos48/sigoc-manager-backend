import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ListAlt as ListAltIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Outlet } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 200;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Layout = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, isAuthenticated, logout } = useAuth();

  // Estado para o menu de usuário
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  // Manipuladores para o menu de usuário
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/login');
  };

  // Obter o nome de usuário
  const getUserName = () => {
    if (!userInfo) return 'Visitante';
    return userInfo.nome_completo || userInfo.username || 'Usuário';
  };


  // Obter o avatar do usuário
  const getUserAvatar = () => {
    if (!userInfo) return <PersonIcon />;
    const name = userInfo.nome_completo || userInfo.username || '';
    return name.charAt(0).toUpperCase();
  };

  // Obter o tipo de acesso baseado no papel (role)
  const getAccessType = () => {
    if (!userInfo) return 'Visualização';
    if (userInfo.is_superuser) return 'Administrador';
    if (userInfo.is_staff) return 'Cadastrador';
    return 'Visualização';
  };

  // Filtrar itens de menu baseado no status de autenticação
  const getMenuItems = () => {
    // Menu items disponíveis para todos os usuários
    const items = [
      { text: 'Início', icon: <HomeIcon />, path: '/' },
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { text: 'Processos', icon: <ListAltIcon />, path: '/processos' },
    ];

    // Adiciona itens baseados no papel do usuário
    if (isAuthenticated) {
      if (userInfo?.role === 'admin' || userInfo?.role === 'cadastrador') {
        items.push({ text: 'Novo Processo', icon: <AddIcon />, path: '/novo-processo' });
      }

      if (userInfo?.role === 'admin') {
        items.push({ text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' });
      }
    }

    // Adiciona o item de login apenas para usuários não autenticados
    if (!isAuthenticated) {
      items.push({ text: 'Login', icon: <AccountCircleIcon />, path: '/login' });
    }

    return items;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={open}>
      <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: '#ffffff',        // Texto em branco
              fontWeight: 500,         // Um pouco mais de largura na fonte
              letterSpacing: '0.5px',  // Ligeiro espaçamento entre letras
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'  // Sombra sutil
            }}
          >
            SIGOC - Sistema Integrado de Controle de Órgãos Externos
          </Typography>

          {isAuthenticated ? (
            <>
              <Tooltip title="Configurações da conta">
                <IconButton
                  onClick={handleUserMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={openUserMenu ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openUserMenu ? 'true' : undefined}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: theme.palette.secondary.main,
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getUserAvatar()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openUserMenu}
                onClose={handleUserMenuClose}
                onClick={handleUserMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    {userInfo?.username || 'Usuário'}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{ ml: 2 }}
            >
              <Tooltip title="Fazer login">
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.grey[500] }}>
                  <PersonIcon />
                </Avatar>
              </Tooltip>
            </IconButton>
          )}
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2 }}>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1 }}>
              SIGOC
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <List>
          {getMenuItems().map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={isActive}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.light + '20',
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: theme.palette.primary.light + '30',
                    }
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? theme.palette.primary.main : 'inherit'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 'bold' : 'normal',
                      color: isActive ? 'primary' : 'inherit'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                mr: 1,
                bgcolor: isAuthenticated ? theme.palette.secondary.main : theme.palette.grey[400],
                fontSize: '0.75rem'
              }}
            >
              {getUserAvatar()}
            </Avatar>
            <Typography variant="body2" color="text.primary" fontWeight="medium">
              {getUserName()}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Acesso: {getAccessType()}
          </Typography>
          {isAuthenticated && (
            <Box sx={{ mt: 1 }}>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': { textDecoration: 'underline' }
                }}
                onClick={handleLogout}
              >
                <LogoutIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                Sair do sistema
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
        {children}
      </Main>
    </Box>
  );
};


export default Layout;
