import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container, Grid, Card, Box, Typography, Button } from '@mui/material';
import {
  setPendingUser,
  clearPendingUser,
} from '../../../features/user/pendingUserSlice';

import { removePending } from '../../../features/user/pendingSlice';

import { Stack } from '@mui/system';

const PendingUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => {
    return state.user;
  });
  const pendingData = useSelector((state) => {
    return state.pending;
  });

  if (pendingData.loading) {
    return <div>loading</div>;
  }
  if (pendingData.error !== null && pendingData.error !== '') {
    return <div>error fetching pending users</div>;
  } else {
    return (
      <>
        {pendingData.data.length === 0 ? (
          <Container>
            <Stack justifyContent={'center'} alignItems={'center'}>
              <Typography variant="h3" marginTop={30}>
                No requests are pending for now
              </Typography>
            </Stack>
          </Container>
        ) : (
          <Container>
            <Grid
              container
              rowSpacing={2}
              columnSpacing={{ xs: 3 }}
              marginTop={5}
            >
              {pendingData.data.map((user, index) => {
                return (
                  <Grid item xs={12} key={user.id} marginBottom={2}>
                    <Card
                      sx={{
                        height: '100px',
                        padding: '30px',
                        display: 'flex',
                        flexDirection: 'row',
                        cursor: 'pointer',
                        background: 'linear-gradient(to left, #F9F5D7, #fff)',
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
                          <Typography
                            variant="h4"
                            onClick={() => {
                              dispatch(
                                setPendingUser({
                                  data: {
                                    name: `${user.firstname} ${user.lastname}`,
                                    id: `${user.id}`,
                                    phone: `${user.phone}`,
                                    email: `${user.email}`,
                                  },
                                })
                              );
                              navigate(`/dashboard/feed/user/`);
                            }}
                          >
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
                      >
                        <Stack>
                          <Button
                            variant="contained"
                            style={{ backgroundColor: '#EA906C' }}
                            onClick={() => {
                              dispatch(
                                removePending({
                                  userId: userData.data.data.user.id,
                                  pendingId: user.id,
                                })
                              );
                            }}
                          >
                            Remove Request
                          </Button>
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Container>
        )}
      </>
    );
  }
};

export default PendingUsers;
