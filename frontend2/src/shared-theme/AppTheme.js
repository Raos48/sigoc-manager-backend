import { createTheme } from '@mui/material';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1976d2',
          color: '#fff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#fff',
        },
      },
    },
  },
});