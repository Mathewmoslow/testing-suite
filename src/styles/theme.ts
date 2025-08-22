import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2C3E50',
      light: '#34495E',
      dark: '#1A252F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#16A085',
      light: '#1ABC9C',
      dark: '#0E6655',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#E74C3C',
      light: '#EC7063',
      dark: '#C0392B',
    },
    warning: {
      main: '#F39C12',
      light: '#F5B041',
      dark: '#D68910',
    },
    info: {
      main: '#3498DB',
      light: '#5DADE2',
      dark: '#2874A6',
    },
    success: {
      main: '#27AE60',
      light: '#52BE80',
      dark: '#1E8449',
    },
    neutral: {
      main: '#95A5A6',
      light: '#BDC3C7',
      dark: '#7F8C8D',
      contrastText: '#2C3E50',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#5D6D7E',
      disabled: '#ABB2B9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '8px 20px',
          fontSize: '0.9375rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A252F 0%, #2C3E50 100%)',
          },
        },
        containedSecondary: {
          background: '#16A085',
          '&:hover': {
            background: '#0E6655',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.06)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 6,
            '& fieldset': {
              borderColor: '#E0E6ED',
            },
            '&:hover fieldset': {
              borderColor: '#BDC3C7',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3498DB',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
          borderRadius: 4,
          backgroundColor: '#E0E6ED',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.9375rem',
        },
        standardInfo: {
          backgroundColor: alpha('#3498DB', 0.1),
          color: '#2874A6',
        },
        standardSuccess: {
          backgroundColor: alpha('#27AE60', 0.1),
          color: '#1E8449',
        },
        standardWarning: {
          backgroundColor: alpha('#F39C12', 0.1),
          color: '#D68910',
        },
        standardError: {
          backgroundColor: alpha('#E74C3C', 0.1),
          color: '#C0392B',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#F8F9FA',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#2C3E50',
            borderBottom: '2px solid #E0E6ED',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#3498DB', 0.04),
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2C3E50',
          fontSize: '0.8125rem',
          borderRadius: 4,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#2C3E50',
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    ...theme.palette,
    mode: 'dark',
    background: {
      default: '#1A1D23',
      paper: '#22252C',
    },
    text: {
      primary: '#E0E6ED',
      secondary: '#ABB2B9',
      disabled: '#5D6D7E',
    },
  },
});