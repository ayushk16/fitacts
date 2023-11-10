import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { AiOutlineHome } from 'react-icons/ai';
import { removeUserToken } from '../functions/tokenSet';

const DashboardHeader = () => {
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
              <AiOutlineHome className="home-icon" />
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
                removeUserToken();
                navigate('/login');
              }}
              variant="h6"
              noWrap
              component="div"
            >
              LogOut
            </Typography>
          </Stack>
          <div className="trelloLogo"></div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default DashboardHeader;
