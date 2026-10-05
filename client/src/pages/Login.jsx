import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, AlternateEmail } from '@mui/icons-material';
import Header from '../components/Header';
import { login } from '../features/user/userSlice';
import { setUserToken } from '../functions/tokenSet';
import { encryptAuthPayload } from '../functions/crypto';
import config from '../functions/config';
import { SnackBarContext } from '../App';
import { useThemeMode } from '../theme/ThemeContext';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter your email or username and password');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const rawPayload = {
        email: identifier.trim(),
        username: identifier.trim(),
        password,
      };

      // Encrypt auth payload against MITM attacks
      const securePayload = encryptAuthPayload(rawPayload);

      const res = await axios.post(`${config.API_BASE_URL}/login`, securePayload);

      if (res.data?.data) {
        const { token, user } = res.data.data;
        setUserToken({
          token: token.accessToken,
          refreshToken: token.refreshToken,
          user,
        });

        dispatch(login(res.data));
        handleOpenSnackBar(`Welcome back, ${user.firstname}!`);
        navigate('/dashboard/timeline');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMessage =
        err.response?.data?.message || err.response?.data?.status || 'Invalid email/username or password';
      setErrorMessage(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoUser = (userIdentifier, userPass) => {
    setIdentifier(userIdentifier);
    setPassword(userPass);
    setErrorMessage('');
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 70px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          px: 2,
          bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc',
        }}
      >
        <Container maxWidth="xs">
          <Card
            sx={{
              p: { xs: 2, sm: 3.5 },
              borderRadius: 4,
              bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3.5 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  Welcome Back
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Log in to track workouts and connect with friends
                </Typography>
              </Box>

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Email or Username"
                    fullWidth
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmail fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    sx={{
                      py: 1.5,
                      mt: 1,
                      fontWeight: 700,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                    }}
                  >
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  OR TRY DEMO ACCOUNTS
                </Typography>
              </Divider>

              {/* Demo quick-fill chips */}
              <Stack direction="row" spacing={1} justifyContent="center">
                <Chip
                  label="Ayush (ayush@gmail.com)"
                  onClick={() => fillDemoUser('ayush@gmail.com', 'ayush123')}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Demo (demo@gmail.com)"
                  onClick={() => fillDemoUser('demo@gmail.com', 'demo123')}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>

              <Stack direction="row" spacing={1} justifyContent="center">

                <Chip
                  label="Sarah (sarah_runner)"
                  onClick={() => fillDemoUser('sarah_runner', 'sarah123')}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Alex (runner_muucj7of)"
                  onClick={() => fillDemoUser('runner_muucj7of', 'Alex123')}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              </Stack>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
