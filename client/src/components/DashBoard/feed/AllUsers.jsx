import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Skeleton,
  Typography,
} from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unfollow } from '../../../features/user/followingSlice';
import { addPending, removePending } from '../../../features/user/pendingSlice';
const AllUsers = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => {
    return state.users;
  });
  const activities = useSelector((state) => {
    return state.activities;
  });
  const following = useSelector((state) => {
    return state.following;
  });
  const pending = useSelector((state) => {
    return state.pending;
  });
  const userData = useSelector((state) => {
    return state.user;
  });

  const followuser = (data) => {
    dispatch(addPending(data));
  };
  const unfollowuser = (data) => {
    dispatch(unfollow(data));
  };
  const removeFromPending = (data) => {
    dispatch(removePending(data));
  };

  if (users.loading || activities.loading || following.loading) {
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
  if (users.error !== null && users.error !== '') {
    return <div>error fetching users</div>;
  }
  if (activities.error !== null && activities.error !== '') {
    return <div>error fetching activities</div>;
  }
  if (following.error !== null && following.error !== '') {
    return <div>error fetching following</div>;
  } else {
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
            {users.data &&
              users.data.map((user, index) => {
                return (
                  <React.Fragment key={user.id}>
                    {userData.data.data.user.id === user.id ? null : (
                      <Grid item xs={12} key={user.id} marginBottom={2}>
                        <Card
                          sx={{
                            height: '100px',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'row',

                            background:
                              'linear-gradient(to left, #F9F5D7, #fff)',
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
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                color: '#A7727D',
                              }}
                            >
                              {user.favorites &&
                                user.favorites.map((fav, index) => {
                                  return (
                                    <Typography
                                      variant="h6"
                                      sx={{ marginRight: '20px' }}
                                      key={index}
                                    >
                                      {
                                        activities.data.find(
                                          (activity) => activity.id === fav
                                        ).name
                                      }
                                    </Typography>
                                  );
                                })}
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
                              {following.data.find(
                                (follow) => follow.followeduserid === user.id
                              ) ? (
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: '#B31312',
                                    color: '#FAFDD6',
                                  }}
                                  onClick={(e) => {
                                    unfollowuser({
                                      userId: userData.data.data.user.id,
                                      followingId: user.id,
                                    });
                                  }}
                                >
                                  Unfollow
                                </Button>
                              ) : pending.data.find(
                                  (pendingUser) =>
                                    pendingUser.followeduserid === user.id
                                ) ? (
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: '#EA906C',
                                    color: 'white',
                                  }}
                                  onClick={(e) => {
                                    removeFromPending({
                                      userId: userData.data.data.user.id,
                                      pendingId: user.id,
                                    });
                                  }}
                                >
                                  Remove Request
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  style={{
                                    backgroundColor: '#B06161',
                                    color: '#FAFDD6',
                                  }}
                                  onClick={(e) => {
                                    followuser({
                                      userId: userData.data.data.user.id,
                                      pendingId: user.id,
                                    });
                                  }}
                                >
                                  Send Request
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    )}
                  </React.Fragment>
                );
              })}
          </Grid>
        </Container>
      </>
    );
  }
};

export default AllUsers;
