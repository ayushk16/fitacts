import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Stack,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { IoFitness, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { AiOutlineHome } from 'react-icons/ai';
import { FaUser, FaSignOutAlt, FaRunning, FaUsers, FaStopwatch } from 'react-icons/fa';
import { getUser, removeUserToken, getToken } from '../functions/tokenSet';
import { login, logout } from '../features/user/userSlice';
import { useThemeMode } from '../theme/ThemeContext';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { mode, toggleTheme } = useThemeMode();
  const userData = getUser();

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token && !user) {
      removeUserToken();
      navigate('/login');
    } else if (token && user) {
      dispatch(login({ data: { token: { accessToken: token }, user } }));
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    setAnchorEl(null);
    removeUserToken();
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { label: 'Timeline', path: '/dashboard/timeline', icon: <AiOutlineHome fontSize={18} /> },
    { label: 'Activities', path: '/dashboard/activities', icon: <FaRunning fontSize={16} /> },
    { label: 'Fitscale', path: '/dashboard/fitscale', icon: <FaStopwatch fontSize={16} /> },
    { label: 'Community', path: '/dashboard/feed', icon: <FaUsers fontSize={16} /> },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: mode === 'dark' ? '#0f172a' : '#ffffff',
        borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: mode === 'dark' ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 12px rgba(0, 0, 0, 0.04)',
        zIndex: 1100,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Brand Logo */}
        <Box
          onClick={() => navigate('/dashboard/timeline')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            }}
          >
            <IoFitness fontSize={22} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.03em',
              display: { xs: 'none', sm: 'block' },
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

        {/* Center Navigation Links */}
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={{ textDecoration: 'none' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: { xs: 1.5, sm: 2 },
                    py: 1,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    transition: 'all 0.2s ease',
                    color: isActive
                      ? '#ffffff'
                      : mode === 'dark'
                      ? '#94a3b8'
                      : '#64748b',
                    bgcolor: isActive
                      ? '#6366f1'
                      : 'transparent',
                    boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
                    '&:hover': {
                      color: isActive ? '#ffffff' : mode === 'dark' ? '#f8fafc' : '#0f172a',
                      bgcolor: isActive ? '#6366f1' : mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {item.icon}
                  <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                    {item.label}
                  </Box>
                </Box>
              </NavLink>
            );
          })}
        </Stack>

        {/* Right side: Theme Switcher & User Profile Menu */}
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

          {userData && (
            <>
              <Box
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  p: 0.5,
                  borderRadius: 3,
                  transition: 'bgcolor 0.2s',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: mode === 'dark' ? '#6366f1' : '#4f46e5',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {userData.firstname?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                  <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                    {userData.firstname} {userData.lastname}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{userData.username || 'user'}
                  </Typography>
                </Box>
              </Box>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    borderRadius: 3,
                    mt: 1.5,
                    minWidth: 180,
                    bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                    backgroundImage: 'none',
                    boxShadow: mode === 'dark' ? '0 10px 25px rgba(0, 0, 0, 0.6)' : '0 10px 25px rgba(0, 0, 0, 0.08)',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate(`/profile/${userData.username || userData.firstname}`);
                  }}
                  sx={{ py: 1.2 }}
                >
                  <ListItemIcon>
                    <FaUser fontSize={16} />
                  </ListItemIcon>
                  My Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: 'error.main' }}>
                  <ListItemIcon sx={{ color: 'error.main' }}>
                    <FaSignOutAlt fontSize={16} />
                  </ListItemIcon>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
