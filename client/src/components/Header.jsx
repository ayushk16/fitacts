import React from 'react';
import { AppBar, Box, Stack, Toolbar, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { IoFitness, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { NavLink, useNavigate } from 'react-router-dom';
import { useThemeMode } from '../theme/ThemeContext';

const Header = () => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: mode === 'dark' ? '#0f172a' : '#ffffff',
        borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Brand Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            }}
          >
            <IoFitness fontSize={24} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: mode === 'dark'
                ? 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)'
                : 'linear-gradient(90deg, #0f172a 0%, #334155 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FitActs
          </Typography>
        </Box>

        {/* Right side controls: Theme Toggle + Auth Links */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Tooltip title={`Switch to ${mode === 'dark' ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                color: mode === 'dark' ? '#fbbf24' : '#6366f1',
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              {mode === 'dark' ? <IoSunnyOutline fontSize={20} /> : <IoMoonOutline fontSize={20} />}
            </IconButton>
          </Tooltip>

          <Button
            component={NavLink}
            to="/login"
            variant="text"
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              px: 2,
            }}
          >
            Log In
          </Button>

          <Button
            component={NavLink}
            to="/signup"
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 600,
              px: 2.5,
              borderRadius: 3,
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            }}
          >
            Sign Up
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
