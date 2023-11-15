import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container, Grid, Card, Box, Typography } from '@mui/material';

const FollowingUsers = () => {
  const navigate = useNavigate();
  const followingData = useSelector((state) => {
    return state.following;
  });

  if (followingData.loading) {
    return <div>loading</div>;
  }
  if (followingData.error !== null && followingData.error !== '') {
    return <div>error fetching following</div>;
  } else {
    return (
      <>
        <Container>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 3 }}
            marginTop={5}
          >
            {followingData.data.map((user, index) => {
              return (
                <Grid item xs={12}>
                  <Card
                    sx={{
                      height: '100px',
                      padding: '30px',
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                    onClick={() => {
                      navigate(`/events/${user.id}`);
                    }}
                  >
                    <Box
                      width={'70%'}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'start',
                        paddingX: '30px',
                      }}
                    >
                      <Box>
                        <Typography variant="h4">
                          {user.firstname} {user.lastname}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      width={'29%'}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                      }}
                    ></Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </>
    );
  }
};

export default FollowingUsers;
