import { createTheme } from '@mui/material/styles';

export const sportTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FF6B35', // Energetic orange
      light: '#FF8A65',
      dark: '#E64A19',
    },
    secondary: {
      main: '#00E676', // Athletic green
      light: '#69F0AE',
      dark: '#00C853',
    },
    background: {
      default: '#0D1117', // Deep dark
      paper: '#161B22',
    },
    text: {
      primary: '#F0F6FC',
      secondary: '#8B949E',
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
    info: {
      main: '#29B6F6',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      background: 'linear-gradient(45deg, #FF6B35, #00E676)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h4: {
      fontWeight: 700,
      fontSize: '2rem',
      background: 'linear-gradient(45deg, #FF6B35, #00E676)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(22, 27, 34, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 53, 0.1)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            border: '1px solid rgba(255, 107, 53, 0.3)',
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(255, 107, 53, 0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(45deg, #FF6B35, #E64A19)',
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '12px 24px',
          boxShadow: '0 4px 20px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #E64A19, #D84315)',
            boxShadow: '0 6px 25px rgba(255, 107, 53, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#FF6B35',
          color: '#FF6B35',
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          '&:hover': {
            borderColor: '#E64A19',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(22, 27, 34, 0.95) 0%, rgba(22, 27, 34, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 107, 53, 0.1)',
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(13, 17, 23, 0.98) 0%, rgba(22, 27, 34, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 107, 53, 0.2)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, rgba(13, 17, 23, 0.98) 0%, rgba(22, 27, 34, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 107, 53, 0.2)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
        },
        bar: {
          background: 'linear-gradient(45deg, #FF6B35, #00E676)',
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #FF6B35, #E64A19)',
          color: 'white',
        },
        colorSecondary: {
          background: 'linear-gradient(45deg, #00E676, #00C853)',
          color: 'white',
        },
      },
    },
  },
});