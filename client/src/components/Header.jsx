import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { IoFitness } from 'react-icons/io5';

import { NavLink, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  return (
    <>
      <Box position="sticky" top={0} sx={{ bgcolor: '#A7727D' }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              left: '20px',
            }}
          >
            <Typography variant="h5" noWrap component="div">
              <Box>
                <IoFitness className="home-icon" />
              </Box>
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
            <Typography variant="h6" noWrap component="div">
              <NavLink
                to={'/login'}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#EDDBC7' : 'black',
                  width: '100%',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                })}
              >
                Login
              </NavLink>
            </Typography>

            <Typography variant="h6" noWrap component="div">
              <NavLink
                to={'/signup'}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#EDDBC7' : 'black',
                  width: '100%',
                  fontSize: '1.5rem',
                  textAlign: 'center',
                })}
              >
                Signup
              </NavLink>
            </Typography>
          </Stack>
        </Toolbar>
      </Box>
    </>
  );
};

export default Header;
