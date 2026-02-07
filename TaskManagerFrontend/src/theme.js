import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
          contrastText: '#ffffff',
        },
        success: {
          main: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        warning: {
          main: '#f59e0b',
          light: '#fbbf24',
          dark: '#d97706',
        },
        error: {
          main: '#ef4444',
          light: '#f87171',
          dark: '#dc2626',
        },
        info: {
          main: '#3b82f6',
          light: '#60a5fa',
          dark: '#2563eb',
        },
        background: {
          default: '#f8fafc',
          paper: '#ffffff',
        },
        text: {
          primary: '#0f172a',
          secondary: '#64748b',
          disabled: '#cbd5e1',
        },
        grey: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        divider: '#e2e8f0',
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#818cf8',
          light: '#a5b4fc',
          dark: '#6366f1',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#a78bfa',
          light: '#c4b5fd',
          dark: '#8b5cf6',
          contrastText: '#ffffff',
        },
        success: {
          main: '#34d399',
          light: '#6ee7b7',
          dark: '#10b981',
        },
        warning: {
          main: '#fbbf24',
          light: '#fcd34d',
          dark: '#f59e0b',
        },
        error: {
          main: '#f87171',
          light: '#fca5a5',
          dark: '#ef4444',
        },
        info: {
          main: '#60a5fa',
          light: '#93c5fd',
          dark: '#3b82f6',
        },
        background: {
          default: '#0f172a',
          paper: '#1e293b',
        },
        text: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          disabled: '#475569',
        },
        grey: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155',
          300: '#475569',
          400: '#64748b',
          500: '#94a3b8',
          600: '#cbd5e1',
          700: '#e2e8f0',
          800: '#f1f5f9',
          900: '#f8fafc',
        },
        divider: '#334155',
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px 0px rgba(0,0,0,0.05)',
    '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.06)',
    '0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)',
    '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)',
    '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)',
    '0px 25px 50px -12px rgba(0,0,0,0.25)',
    '0px 2px 4px 0px rgba(0,0,0,0.1)',
    '0px 3px 5px 0px rgba(0,0,0,0.12)',
    '0px 4px 8px 0px rgba(0,0,0,0.14)',
    '0px 5px 10px 0px rgba(0,0,0,0.16)',
    '0px 6px 12px 0px rgba(0,0,0,0.18)',
    '0px 7px 14px 0px rgba(0,0,0,0.20)',
    '0px 8px 16px 0px rgba(0,0,0,0.22)',
    '0px 9px 18px 0px rgba(0,0,0,0.24)',
    '0px 10px 20px 0px rgba(0,0,0,0.26)',
    '0px 11px 22px 0px rgba(0,0,0,0.28)',
    '0px 12px 24px 0px rgba(0,0,0,0.30)',
    '0px 13px 26px 0px rgba(0,0,0,0.32)',
    '0px 14px 28px 0px rgba(0,0,0,0.34)',
    '0px 15px 30px 0px rgba(0,0,0,0.36)',
    '0px 16px 32px 0px rgba(0,0,0,0.38)',
    '0px 17px 34px 0px rgba(0,0,0,0.40)',
    '0px 18px 36px 0px rgba(0,0,0,0.42)',
    '0px 19px 38px 0px rgba(0,0,0,0.44)',
  ],
});

export default theme;
