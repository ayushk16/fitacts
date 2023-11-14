import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { IoFitness } from 'react-icons/io5';

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box
            onClick={() => {
              navigate('/dashboard/timeline');
            }}
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              left: '20px',
            }}
          >
            <Typography variant="h5" noWrap component="div">
              <IoFitness className="home-icon" />
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              position: 'absolute',
              right: '20px',
            }}
          >
            <Typography
              onClick={() => {
                navigate('/login');
              }}
              variant="h6"
              noWrap
              component="div"
            >
              Login
            </Typography>
            <Typography
              onClick={() => {
                navigate('/signup');
              }}
              variant="h6"
              noWrap
              component="div"
            >
              Signup
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
