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
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Stack,
  Paper,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Visibility as VisibilityIcon,
  AccountCircle,
  ChevronLeft as ChevronLeftIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  HourglassEmpty as HourglassIcon,
  PriorityHigh as PriorityHighIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useAuth } from '../contexts/useAuth';

// Largura do drawer quando aberto
const drawerWidth = 240;

// Lista de itens do menu
const menuItems = [
  { text: 'Página Inicial', icon: <HomeIcon />, path: '/' },
  { text: 'Visão Geral', icon: <DashboardIcon />, path: '/visao-geral' },
  { text: 'Painel de Controle', icon: <BarChartIcon />, path: '/dashboard' },
  { text: 'Gráficos e Relatórios', icon: <AssessmentIcon />, path: '/graficos' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
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
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
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
            background: 'linear-gradient(180deg, #1565c0 0%, #1976d2 100%)',
            color: 'white',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            '& .MuiListItemIcon-root': {
              color: 'white',
            },
            '& .MuiListItemButton-root': {
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
              },
              '&.Mui-selected': {
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.2),
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.common.white, 0.25),
                },
              },
            },
            '& .MuiDivider-root': {
              borderColor: 'rgba(255, 255, 255, 0.12)',
            },
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
          width: '100%',
          transition: (theme) => theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        
        {/* Cards de Métricas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'warning.main',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.light', width: 40, height: 40 }}>
                    <HourglassIcon sx={{ color: 'warning.dark' }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Processos Pendentes
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>45</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'error.main',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', width: 40, height: 40 }}>
                    <WarningIcon sx={{ color: 'error.dark' }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Processos Vencidos
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>12</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'info.main',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.light', width: 40, height: 40 }}>
                    <AccessTimeIcon sx={{ color: 'info.dark' }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Tempo Médio
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>15 dias</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'success.main',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.light', width: 40, height: 40 }}>
                    <CheckCircleIcon sx={{ color: 'success.dark' }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Processos no Prazo
                  </Typography>
                </Stack>
                <Box sx={{ mt: 3, mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={89} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'success.light',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: 'success.main',
                      }
                    }} 
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold" sx={{ textAlign: 'right', color: 'success.main' }}>89</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'primary.main',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                    <TrendingUpIcon sx={{ color: 'primary.dark' }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Taxa de Conclusão
                  </Typography>
                </Stack>
                <Box sx={{ mt: 3, mb: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={78} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: 'primary.light',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: 'primary.main',
                      }
                    }} 
                  />
                </Box>
                <Typography variant="body2" fontWeight="bold" sx={{ textAlign: 'right', color: 'primary.main' }}>78%</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  backgroundColor: 'error.main',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.light', width: 40, height: 40 }}>
                    <PriorityHighIcon sx={{ color: 'error.dark' }} />
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight="medium" color="text.secondary">
                    Processos Urgentes
                  </Typography>
                </Stack>
                <Typography variant="h3" fontWeight="bold" sx={{ mt: 2 }}>8</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabela de Processos */}
        
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;