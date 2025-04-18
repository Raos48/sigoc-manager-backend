import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Folder as FolderIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
  CalendarMonth as CalendarIcon,
  AccountCircle,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';

// Largura do drawer quando aberto
const drawerWidth = 240;

// Lista de itens do menu
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Processos', icon: <FolderIcon />, path: '/processos' },
  { text: 'Tipos de Demanda', icon: <AssignmentIcon />, path: '/tipos-demanda' },
  { text: 'Tipos de Reunião', icon: <AssignmentIcon />, path: '/tipos-reuniao' },
  { text: 'Reuniões', icon: <CalendarIcon />, path: '/reunioes' },
  { text: 'Atribuições', icon: <AssignmentIcon />, path: '/atribuicoes' },
  { text: 'Grupos de Auditores', icon: <GroupIcon />, path: '/grupos-auditores' },
  { text: 'Auditores', icon: <GroupIcon />, path: '/auditores' },
  { text: 'Unidades', icon: <BusinessIcon />, path: '/unidades' },
  { text: 'Tipos de Processo', icon: <CategoryIcon />, path: '/tipos-processo' },
  { text: 'Situações', icon: <SettingsIcon />, path: '/situacoes' },
  { text: 'Categorias', icon: <CategoryIcon />, path: '/categorias' },
];

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Gerenciar drawer
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Gerenciar menu do usuário
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  // Verificar qual menu está ativo
  const isActive = (path) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Menu Superior */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="abrir menu"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SIGOC - Sistema Integrado de Gestão de Órgãos de Controle
          </Typography>
          
          {/* Perfil do Usuário */}
          <div>
            <Tooltip title="Configurações do Usuário">
              <IconButton
                size="large"
                aria-label="conta do usuário"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Perfil</MenuItem>
              <MenuItem onClick={handleClose}>Configurações</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Sair</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
      {/* Menu Lateral */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon sx={{ color: '#fff' }} />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ display: 'block' }}
              onClick={() => navigate(item.path)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
                selected={isActive(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ opacity: open ? 1 : 0 }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 64}px)` },
          ml: { sm: `${open ? drawerWidth : 64}px` },
          transition: (theme) => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;