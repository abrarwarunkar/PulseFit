import { createTheme } from '@mui/material/styles';

export const aiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E5FF',
      light: '#62EFFF',
      dark: '#00B2CC',
    },
    secondary: {
      main: '#FF6B35',
      light: '#FF9563',
      dark: '#C73E0A',
    },
    background: {
      default: '#0A0E27',
      paper: '#1A1F3A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
    success: {
      main: '#00E676',
    },
    warning: {
      main: '#FFB74D',
    },
    error: {
      main: '#FF5252',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      background: 'linear-gradient(45deg, #00E5FF, #FF6B35)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h4: {
      fontWeight: 600,
      background: 'linear-gradient(45deg, #00E5FF, #FF6B35)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(26, 31, 58, 0.4) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 229, 255, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s ease',
          '&:hover': {
            border: '1px solid rgba(0, 229, 255, 0.3)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0, 229, 255, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(45deg, #00E5FF, #FF6B35)',
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #00B2CC, #C73E0A)',
            boxShadow: '0 6px 25px rgba(0, 229, 255, 0.4)',
          },
        },
        outlined: {
          borderColor: '#00E5FF',
          color: '#00E5FF',
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            borderColor: '#00B2CC',
            backgroundColor: 'rgba(0, 229, 255, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(26, 31, 58, 0.9) 0%, rgba(26, 31, 58, 0.6) 100%)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(0, 229, 255, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 229, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, rgba(10, 14, 39, 0.98) 0%, rgba(26, 31, 58, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(0, 229, 255, 0.1)',
        },
      },
    },
  },
});