import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  AlternateEmail,
} from '@mui/icons-material';
import Header from '../components/Header';
import { login } from '../features/user/userSlice';
import { setUserToken } from '../functions/tokenSet';
import { encryptAuthPayload } from '../functions/crypto';
import config from '../functions/config';
import { SnackBarContext } from '../App';
import { useThemeMode } from '../theme/ThemeContext';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    passwordAgain: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real-time username state handling
  const [usernameStatus, setUsernameStatus] = useState('idle'); // 'idle' | 'checking' | 'available' | 'unavailable' | 'invalid'
  const [usernameFeedback, setUsernameFeedback] = useState('');

  // Debounced real-time username availability check
  const checkUsername = useCallback(async (name) => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) {
      setUsernameStatus('idle');
      setUsernameFeedback('');
      return;
    }

    const validPattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!validPattern.test(trimmed)) {
      setUsernameStatus('invalid');
      setUsernameFeedback('Must be 3-20 letters, numbers, or underscores');
      return;
    }

    setUsernameStatus('checking');
    setUsernameFeedback('Checking availability...');

    try {
      const res = await axios.get(`${config.API_BASE_URL}/signup/check-username`, {
        params: { username: trimmed },
      });

      if (res.data?.available) {
        setUsernameStatus('available');
        setUsernameFeedback(`@${trimmed} is available!`);
      } else {
        setUsernameStatus('unavailable');
        setUsernameFeedback(res.data?.message || 'Username already taken');
      }
    } catch (err) {
      console.error('Error checking username:', err);
      setUsernameStatus('idle');
      setUsernameFeedback('');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username) {
        checkUsername(formData.username);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData.username, checkUsername]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errorMessage) setErrorMessage('');
  };

  const isFormValid = () => {
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      setErrorMessage('Please enter your full name');
      return false;
    }
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (usernameStatus !== 'available') {
      setErrorMessage('Please choose an available username');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.passwordAgain) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      };

      // Encrypt payload to protect against Man-in-the-Middle (MITM) attacks
      const securePayload = encryptAuthPayload(payload);

      const res = await axios.post(`${config.API_BASE_URL}/signup`, securePayload);

      if (res.data?.data) {
        const { token, user } = res.data.data;
        setUserToken({
          token: token.accessToken,
          refreshToken: token.refreshToken,
          user,
        });
        dispatch(login(res.data));
        handleOpenSnackBar('Welcome to FitActs! Account created successfully');
        navigate('/dashboard/timeline');
      }
    } catch (err) {
      console.error('Signup error:', err);
      const serverMessage =
        err.response?.data?.message || err.response?.data?.status || 'Signup failed. Please try again.';
      setErrorMessage(serverMessage);
    } finally {
      setSubmitting(false);
    }
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
        <Container maxWidth="sm">
          <Card
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 4,
              bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  Create Your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join the athlete community and track your fitness milestones
                </Typography>
              </Box>

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSignup}>
                <Stack spacing={2.5}>
                  {/* First & Last Name */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="First Name"
                      fullWidth
                      required
                      value={formData.firstname}
                      onChange={handleChange('firstname')}
                    />
                    <TextField
                      label="Last Name"
                      fullWidth
                      required
                      value={formData.lastname}
                      onChange={handleChange('lastname')}
                    />
                  </Stack>

                  {/* Email */}
                  <TextField
                    label="Email Address"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange('email')}
                    helperText="We'll never share your email with anyone"
                  />

                  {/* Unique Username with Real-Time Availability Check */}
                  <TextField
                    label="Unique Login Name / Username"
                    fullWidth
                    required
                    value={formData.username}
                    onChange={handleChange('username')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AlternateEmail fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          {usernameStatus === 'checking' && <CircularProgress size={18} />}
                          {usernameStatus === 'available' && (
                            <CheckCircle color="success" fontSize="small" />
                          )}
                          {(usernameStatus === 'unavailable' || usernameStatus === 'invalid') && (
                            <Cancel color="error" fontSize="small" />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      usernameFeedback ? (
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            color:
                              usernameStatus === 'available'
                                ? 'success.main'
                                : usernameStatus === 'unavailable' || usernameStatus === 'invalid'
                                ? 'error.main'
                                : 'text.secondary',
                          }}
                        >
                          {usernameFeedback}
                        </Typography>
                      ) : (
                        'Enter a unique handle for your profile'
                      )
                    }
                    error={usernameStatus === 'unavailable' || usernameStatus === 'invalid'}
                  />

                  {/* Phone */}
                  <TextField
                    label="Phone Number (Optional)"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    placeholder="10 digit number"
                  />

                  {/* Passwords */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      required
                      value={formData.password}
                      onChange={handleChange('password')}
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
                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      fullWidth
                      required
                      value={formData.passwordAgain}
                      onChange={handleChange('passwordAgain')}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>

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
                    {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Log in
                      </Link>
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
