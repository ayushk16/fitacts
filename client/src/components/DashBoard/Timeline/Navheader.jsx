import { Stack, Container, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

const Navheader = () => {
  const UserData = useSelector((state) => {
    if (state.user.data.data) {
      return state.user.data.data.user;
    }
  });

  return (
    <Container>
      <Stack
        spacing={1}
        direction="column"
        justifyContent="center"
        alignItems="center"
        paddingTop={6}
      >
        <Typography variant="h3" component="h2">
          Hi {UserData && UserData.firstname + ' ' + UserData.lastname}
        </Typography>
        <Typography variant="h3" component="h2">
          Welcome to FITACTS.
        </Typography>
      </Stack>
    </Container>
  );
};

export default Navheader;
