import { alpha, createTheme } from '@mui/material/styles'

const primaryMain = '#2065d1'
const primaryDark = '#1242a8'
const neutralBorder = 'rgba(145, 158, 171, 0.18)'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryMain,
      dark: primaryDark,
      light: '#eaf2ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00a76f',
      light: '#dcfff4',
      contrastText: '#ffffff',
    },
    success: {
      main: '#22c55e',
      light: '#dcfce7',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
    },
    info: {
      main: '#0ea5e9',
      light: '#e0f2fe',
    },
    background: {
      default: '#f4f7fb',
      paper: 'rgba(255, 255, 255, 0.88)',
    },
    text: {
      primary: '#1c252e',
      secondary: '#637381',
    },
    divider: neutralBorder,
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Public Sans", "Manrope", "Segoe UI", sans-serif',
    h1: {
      fontSize: 'clamp(3.5rem, 7vw, 5.75rem)',
      lineHeight: 0.98,
      letterSpacing: '-0.055em',
      fontWeight: 800,
    },
    h2: {
      fontSize: 'clamp(2.4rem, 4vw, 3.6rem)',
      lineHeight: 1.02,
      letterSpacing: '-0.045em',
      fontWeight: 800,
    },
    h3: {
      fontSize: '1.5rem',
      lineHeight: 1.18,
      letterSpacing: '-0.02em',
      fontWeight: 700,
    },
    h4: {
      fontSize: '1.125rem',
      lineHeight: 1.3,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.55,
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.65,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '-0.01em',
    },
    overline: {
      fontSize: '0.73rem',
      fontWeight: 800,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at 15% 20%, rgba(32, 101, 209, 0.16), transparent 28%), radial-gradient(circle at 85% 14%, rgba(0, 167, 111, 0.12), transparent 22%), linear-gradient(180deg, #f8fbff 0%, #f4f7fb 52%, #eef4ff 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          border: `1px solid ${neutralBorder}`,
          boxShadow: '0 20px 60px rgba(145, 158, 171, 0.16)',
          backdropFilter: 'blur(18px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: `1px solid ${neutralBorder}`,
          boxShadow: '0 20px 48px rgba(145, 158, 171, 0.12)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 999,
          paddingInline: 20,
        },
        containedPrimary: {
          backgroundColor: '#0b57d0',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#0847ab',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: neutralBorder,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: alpha('#ffffff', 0.78),
          '& fieldset': {
            borderColor: neutralBorder,
          },
          '&:hover fieldset': {
            borderColor: alpha(primaryMain, 0.35),
          },
          '&.Mui-focused fieldset': {
            borderWidth: 1,
            borderColor: primaryMain,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${neutralBorder}`,
        },
        head: {
          color: '#637381',
          fontSize: '0.76rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})
