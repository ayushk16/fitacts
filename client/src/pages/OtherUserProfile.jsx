import React, { useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Container, Stack, Box } from '@mui/system';
import { FaArrowLeft } from 'react-icons/fa';
import { Card, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OtherUserProfile = () => {
  const navigate = useNavigate();

  const userData = useSelector((state) => state.pendingUser.data);

  return (
    <>
      <DashboardHeader />
      <Box
        style={{
          position: 'fixed',
          top: '100px',
          left: '100px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaArrowLeft />
        <Typography>Go Back</Typography>
      </Box>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Stack
          direction="row"
          spacing={3}
          sx={{
            marginTop: '-200px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Typography variant="h3" component={'h3'}>
              {userData.name}'s Profile
            </Typography>
            <Card
              sx={{
                width: '400px',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                padding: '50px',
                background: 'linear-gradient(to top, #F9F5E7, #fff)',
                color: 'black',
              }}
            >
              <Stack direction="row" spacing={1}>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  Name
                </Typography>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  -
                </Typography>
                <Typography textAlign={'center'} fontSize={25}>
                  {userData.name.charAt(0).toUpperCase() +
                    userData.name.slice(1)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  Phone
                </Typography>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  -
                </Typography>
                <Typography textAlign={'center'} fontSize={25}>
                  {userData.phone}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  Email
                </Typography>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  -
                </Typography>
                <Typography textAlign={'center'} fontSize={25}>
                  {userData.email}
                </Typography>
              </Stack>
            </Card>
          </div>
        </Stack>
      </Container>
    </>
  );
};

export default OtherUserProfile;
