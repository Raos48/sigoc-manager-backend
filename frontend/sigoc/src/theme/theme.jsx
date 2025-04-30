import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f5464',
      light: '#4f8293',
      dark: '#1a4855',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#376b7c',
      light: '#6699ab',
      dark: '#2d5966',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#7eb0c2',
      light: '#a3c5d1',
      dark: '#6899ab',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 12,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: '#1f5464',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#1f5464',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#1f5464',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#1f5464',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#1f5464',
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#1f5464',
    },
    subtitle1: {
      fontSize: '0.875rem',
      color: '#376b7c',
    },
    subtitle2: {
      fontSize: '0.75rem',
      color: '#376b7c',
    },
    body1: {
      fontSize: '0.875rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1f5464',
          '&:hover': {
            backgroundColor: '#1a4855',
          },
        },
        containedSecondary: {
          backgroundColor: '#376b7c',
          '&:hover': {
            backgroundColor: '#2d5966',
          },
        },
        outlinedPrimary: {
          borderColor: '#1f5464',
          color: '#1f5464',
          '&:hover': {
            backgroundColor: 'rgba(31, 84, 100, 0.04)',
          },
        },
        outlinedSecondary: {
          borderColor: '#376b7c',
          color: '#376b7c',
          '&:hover': {
            backgroundColor: 'rgba(55, 107, 124, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f5464',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          backgroundColor: 'rgba(31, 84, 100, 0.04)',
        },
        title: {
          fontSize: '1.25rem',
          fontWeight: 500,
          color: '#1f5464',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(31, 84, 100, 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#1f5464',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#1f5464',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        colorPrimary: {
          backgroundColor: 'rgba(31, 84, 100, 0.12)',
          color: '#1f5464',
        },
        colorSecondary: {
          backgroundColor: 'rgba(55, 107, 124, 0.12)',
          color: '#376b7c',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 6px 12px rgba(0, 0, 0, 0.05)',
    '0px 8px 16px rgba(0, 0, 0, 0.05)',
    '0px 10px 20px rgba(0, 0, 0, 0.05)',
    '0px 12px 24px rgba(0, 0, 0, 0.05)',
    '0px 14px 28px rgba(0, 0, 0, 0.05)',
    '0px 16px 32px rgba(0, 0, 0, 0.05)',
    '0px 18px 36px rgba(0, 0, 0, 0.05)',
    '0px 20px 40px rgba(0, 0, 0, 0.05)',
    '0px 22px 44px rgba(0, 0, 0, 0.05)',
    '0px 24px 48px rgba(0, 0, 0, 0.05)',
    '0px 26px 52px rgba(0, 0, 0, 0.05)',
    '0px 28px 56px rgba(0, 0, 0, 0.05)',
    '0px 30px 60px rgba(0, 0, 0, 0.05)',
    '0px 32px 64px rgba(0, 0, 0, 0.05)',
    '0px 34px 68px rgba(0, 0, 0, 0.05)',
    '0px 36px 72px rgba(0, 0, 0, 0.05)',
    '0px 38px 76px rgba(0, 0, 0, 0.05)',
    '0px 40px 80px rgba(0, 0, 0, 0.05)',
    '0px 42px 84px rgba(0, 0, 0, 0.05)',
    '0px 44px 88px rgba(0, 0, 0, 0.05)',
    '0px 46px 92px rgba(0, 0, 0, 0.05)',
    '0px 48px 96px rgba(0, 0, 0, 0.05)',
  ],
});

export default theme;
