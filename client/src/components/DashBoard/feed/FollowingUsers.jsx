import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Grid,
  Card,
  Box,
  Typography,
  Stack,
  Button,
  Skeleton,
} from '@mui/material';
import {
  setFollowedUser,
  clearFollowedUser,
} from '../../../features/user/followedUserSlice';

import { SnackBarContext } from '../../../App.jsx';

import { unfollow } from '../../../features/user/followingSlice';

const FollowingUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleOpenSnackBar } = useContext(SnackBarContext);
  const followingData = useSelector((state) => {
    return state.following;
  });
  const userData = useSelector((state) => {
    return state.user;
  });

  if (followingData.loading) {
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
  if (followingData.error !== null && followingData.error !== '') {
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
        {followingData.data.length === 0 ? (
          <Container>
            <Stack justifyContent={'center'} alignItems={'center'}>
              <Typography variant="h3" marginTop={30}>
                You are not following anyone yet
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
              {followingData.data.map((user, index) => {
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
                                setFollowedUser({
                                  data: {
                                    name: `${user.firstname} ${user.lastname}`,
                                    id: `${user.id}`,
                                  },
                                })
                              );
                              navigate(`/events/${user.firstname}`);
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
                            style={{
                              backgroundColor: '#B31312',
                              color: '#FAFDD6',
                            }}
                            onClick={(e) => {
                              dispatch(
                                unfollow({
                                  userId: userData.data.data.user.id,
                                  followingId: user.id,
                                })
                              ).then(handleOpenSnackBar('unfollowed'));
                            }}
                          >
                            Unfollow
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

export default FollowingUsers;
