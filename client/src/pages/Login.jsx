import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Container,
  FormHelperText,
  FilledInput,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { BorderBottom, Visibility, VisibilityOff } from '@mui/icons-material';
import { login, logout, errorlogin } from '../features/user/userSlice.js';
import Header from '../components/Header.jsx';
const Login = () => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUserState = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isValidated = () => {
    if (userEmail !== '') {
      if (password !== '') {
        return true;
      } else {
        document.getElementById('filled-login-adornment-password').focus();
        return false;
      }
    } else {
      document.getElementById('email-login').focus();
      return false;
    }
  };

  const loginUser = () => {
    const data = { email: userEmail, password: password };
    if (isValidated()) {
      axios
        .get(`http://localhost:3000/login`, { params: data })
        .then((res) => {
          dispatch(login(res.data));
        })
        .then(() => {
          navigate('/dashboard/timeline');
        })
        .catch((err) => {
          dispatch(errorlogin(err));
        });
    }
  };
  return (
    <>
      <Header />
      <Container sx={{ width: '300px' }}>
        <Stack spacing={3}>
          <Typography component="h1" variant="h3">
            Login
          </Typography>
          <FormControl variant="filled">
            <InputLabel htmlFor="email-login">Email address</InputLabel>
            <Input
              id="email-login"
              aria-describedby="email-login-helper-text"
              onChange={(e) => {
                setUserEmail(() => e.target.value);
              }}
            />
            <FormHelperText
              id="email-login-helper-text"
              style={{
                BorderBottom: '1px solid #A7727D',
              }}
            >
              enter your email
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
            <InputLabel htmlFor="filled-login-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              id="filled-login-adornment-password"
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => {
                setPassword(() => e.target.value);
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {currentUserState.error &&
            ((currentUserState.error ===
              'Request failed with status code 404' && (
              <Typography variant="span" component="h4" color="error">
                enter correct credentials
              </Typography>
            )) ||
              (currentUserState.error ===
                'Request failed with status code 401' && (
                <Typography variant="span" component="h4" color="error">
                  enter correct password
                </Typography>
              )))}
          <Button
            variant="contained"
            style={{ backgroundColor: '#A7727D', color: '#FAFDD6' }}
            disableElevation
            onClick={() => loginUser()}
          >
            LOGIN
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Login;
