import React from 'react';
import {
  Container,
  Box,
  Typography,
  InputLabel,
  Input,
  FormHelperText,
  Stack,
} from '@mui/material';
import { FormControl } from '@mui/material';
const Login = () => {
  return (
    <>
      <Container sx={{ border: '1px solid black' }}>
        <Stack sx={{ border: '1px solid red' }}>
          <Typography component="h1" variant="h3">
            login
          </Typography>
          <FormControl>
            <InputLabel htmlFor="email">Email address</InputLabel>
            <Input id="email" aria-describedby="email-helper-text" />
            <FormHelperText id="email-helper-text">
              enter your email
            </FormHelperText>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="password">Email address</InputLabel>
            <Input id="password" aria-describedby="password" />
            <FormHelperText id="password">
              We'll never share your email.
            </FormHelperText>
          </FormControl>
        </Stack>
      </Container>
    </>
  );
};

export default Login;
