import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Container,
  //   FormHelperText,
  FilledInput,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Header from '../components/Header';
import { signup, errorsignup, cleanUp } from '../features/user/userSignupSlice';
const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordError, setpasswordError] = useState(false);
  const [userData, setuserData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    passwordAgain: '',
  });

  const currentUserState = useSelector((state) => state.userSignup);

  useEffect(() => {
    if (userData.password === userData.passwordAgain) {
      setpasswordError(() => false);
    } else {
      setpasswordError(() => true);
    }
  }, [userData]);

  const isValidated = () => {
    try {
      if (userData.firstname !== '') {
        if (userData.lastname !== '') {
          let emailpattern = /^[^ ]+@[^ ]+.+[a-z]{2,3}$/;
          if (userData.email !== '' && userData.email.match(emailpattern)) {
            let phonepattern = /^[0-9]{10}$/;
            if (userData.phone !== '' && userData.phone.match(phonepattern)) {
              if (userData.password !== '') {
                if (userData.passwordAgain !== '') {
                  if (userData.password === userData.passwordAgain) {
                    return true;
                  } else {
                    document
                      .getElementById('filled-adornment-password-again')
                      .focus();
                    return false;
                  }
                } else {
                  document
                    .getElementById('filled-adornment-password-again')
                    .focus();
                  return false;
                }
              } else {
                document.getElementById('filled-adornment-password').focus();
                return false;
              }
            } else {
              document.getElementById('phone').focus();
              return false;
            }
          } else {
            document.getElementById('email').focus();
            return false;
          }
        } else {
          document.getElementById('lastname').focus();
          return false;
        }
      } else {
        document.getElementById('firstname').focus();
        return false;
      }
    } catch (error) {}
  };

  const submitSignup = () => {
    const dataLog = {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
    };
    console.log('submiting initiated', dataLog);

    if (isValidated()) {
      axios
        .post(`http://localhost:3000/signup/`, dataLog)
        .then((res) => {
          dispatch(signup(res.data));
        })
        .then(() => {
          navigate('/login');
        })
        .catch((err) => {
          dispatch(errorsignup(err));
        });
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Header />
      <Container sx={{ width: '300px' }}>
        <Stack spacing={3}>
          <Typography component="h1" variant="h3">
            Sign Up
          </Typography>
          <FormControl>
            <InputLabel htmlFor="firstname">First Name</InputLabel>
            <Input
              id="firstname"
              required
              aria-describedby="firstname-helper-text"
              onChange={(e) => {
                setuserData((prev) => {
                  const data = { ...prev, firstname: e.target.value };
                  return data;
                });
              }}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="lastname">Last Name</InputLabel>
            <Input
              id="lastname"
              required
              aria-describedby="lastname-helper-text"
              onChange={(e) => {
                setuserData((prev) => {
                  const data = { ...prev, lastname: e.target.value };
                  return data;
                });
              }}
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="email">Email address</InputLabel>
            <Input
              required
              id="email"
              aria-describedby="email-helper-text"
              onChange={(e) => {
                setuserData((prev) => {
                  const data = { ...prev, email: e.target.value };
                  return data;
                });
              }}
            />
          </FormControl>
          {currentUserState.error &&
            currentUserState.error ===
              'Request failed with status code 400' && (
              <Typography variant="span" component="h4" color="error">
                email already exists
              </Typography>
            )}

          <FormControl>
            <InputLabel htmlFor="phone">Phone</InputLabel>
            <Input
              id="phone"
              required
              aria-describedby="phone-helper-text"
              onChange={(e) => {
                setuserData((prev) => {
                  const data = { ...prev, phone: e.target.value };
                  return data;
                });
              }}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Enter A Password
            </InputLabel>
            <FilledInput
              id="filled-adornment-password"
              required
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => {
                setuserData((prev) => {
                  const data = { ...prev, password: e.target.value };
                  return data;
                });
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
          <FormControl sx={{ m: 1, width: '25ch' }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password-again">
              Again Enter Password
            </InputLabel>
            <FilledInput
              id="filled-adornment-password-again"
              type={showPassword ? 'text' : 'password'}
              required
              aria-describedby="password-helper-text"
              onChange={(e) => {
                setuserData((prev) => {
                  const data = { ...prev, passwordAgain: e.target.value };
                  return data;
                });
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
            {passwordError == true && (
              <Typography
                variant="span"
                component="h4"
                color="error"
                sx={passwordError && { display: 'block' }}
              >
                enter correct password
              </Typography>
            )}
          </FormControl>
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              submitSignup();
            }}
          >
            SIGNUP
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Signup;
