import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Grid,
  Card,
  Box,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import {
  setPendingUser,
  clearPendingUser,
} from '../../../features/user/pendingUserSlice';

import { Stack } from '@mui/system';

import { accept, reject } from '../../../features/user/requestSlice';

import { SnackBarContext } from '../../../App.jsx';

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleOpenSnackBar } = useContext(SnackBarContext);
  const userData = useSelector((state) => {
    return state.user;
  });
  const requestsData = useSelector((state) => {
    return state.request;
  });

  if (requestsData.loading) {
    return (
      <>
        <Container>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 3 }}
            marginY={5}
            spacing={2}
          >
            <Grid item xs={12} marginBottom={2}>
              <Card
                sx={{
                  height: '100px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'row',

                  background: 'linear-gradient(to left, #F9F5D7, #fff)',
                }}
              >
                <Skeleton width={'100%'} variant="wave" />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
  if (requestsData.error !== null && requestsData.error !== '') {
    return (
      <>
        <Container>
          <Stack justifyContent={'center'} alignItems={'center'}>
            <Typography variant="h3" marginTop={30}>
              error fetching data
            </Typography>
          </Stack>
        </Container>
      </>
    );
  } else {
    return (
      <>
        {requestsData.data.length === 0 ? (
          <Container>
            <Stack justifyContent={'center'} alignItems={'center'}>
              <Typography variant="h3" marginTop={30}>
                No requests found
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
              {requestsData.data.map((user, index) => {
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
                        width={'64%'}
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
                        width={'35%'}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}
                      >
                        <Stack
                          display={'flex'}
                          flexDirection={'row'}
                          gap={5}
                          alignItems={'center'}
                        >
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: '#B31312',
                              color: '#FAFDD6',
                            }}
                            onClick={(e) => {
                              dispatch(
                                reject({
                                  userId: userData.data.data.user.id,
                                  followerId: user.id,
                                })
                              ).then(handleOpenSnackBar('Request Rejected'));
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="contained"
                            style={{ backgroundColor: '#C5E898' }}
                            onClick={() => {
                              dispatch(
                                accept({
                                  userId: userData.data.data.user.id,
                                  followerId: user.id,
                                })
                              ).then(handleOpenSnackBar('Request Accepted'));
                            }}
                          >
                            Accept Request
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

export default Requests;
