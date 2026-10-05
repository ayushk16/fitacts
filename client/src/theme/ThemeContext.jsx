import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const ThemeModeContext = createContext({
  mode: 'dark',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('fitacts_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('fitacts_theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
    if (mode === 'dark') {
      document.body.style.backgroundColor = '#0b0f19';
      document.body.style.color = '#f8fafc';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: {
                  main: '#6366f1', // Electric Indigo
                  light: '#818cf8',
                  dark: '#4f46e5',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#10b981', // Emerald
                  light: '#34d399',
                  dark: '#059669',
                  contrastText: '#ffffff',
                },
                background: {
                  default: '#0b0f19',
                  paper: '#111827',
                },
                text: {
                  primary: '#f8fafc',
                  secondary: '#94a3b8',
                },
                divider: 'rgba(255, 255, 255, 0.08)',
                error: {
                  main: '#f43f5e',
                },
                success: {
                  main: '#10b981',
                },
              }
            : {
                primary: {
                  main: '#4f46e5',
                  light: '#6366f1',
                  dark: '#4338ca',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#059669',
                  light: '#10b981',
                  dark: '#047857',
                  contrastText: '#ffffff',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a',
                  secondary: '#64748b',
                },
                divider: 'rgba(0, 0, 0, 0.08)',
                error: {
                  main: '#e11d48',
                },
                success: {
                  main: '#059669',
                },
              }),
        },
        typography: {
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          h4: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
          },
          h5: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
          },
          h6: {
            fontWeight: 600,
          },
          button: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backgroundImage: 'none',
                border:
                  mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow:
                  mode === 'dark'
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)'
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                padding: '8px 18px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: mode === 'dark' ? '#0f172a' : '#ffffff',
                color: mode === 'dark' ? '#f8fafc' : '#0f172a',
                borderBottom:
                  mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
