import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { unfollow, addFollowing } from '../../../features/user/followingSlice';

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
  const userData = useSelector((state) => {
    return state.user;
  });

  const followuser = (data) => {
    dispatch(addFollowing(data));
  };
  const unfollowuser = (data) => {
    dispatch(unfollow(data));
  };

  if (users.loading || activities.loading || following.loading) {
    return <div>loading</div>;
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
            marginTop={5}
          >
            {users.data &&
              users.data.map((user, index) => {
                return (
                  <>
                    {userData.data.data.user.id === user.id ? null : (
                      <Grid item xs={12} key={user.id}>
                        <Card
                          sx={{
                            height: '100px',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'row',
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
                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
                                  onClick={(e) => {
                                    unfollowuser({
                                      userId: userData.data.data.user.id,
                                      followingId: user.id,
                                    });
                                  }}
                                >
                                  Unfollow
                                </Button>
                              ) : (
                                <Button
                                  onClick={(e) => {
                                    followuser({
                                      userId: userData.data.data.user.id,
                                      followingId: user.id,
                                    });
                                  }}
                                >
                                  Follow
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    )}
                  </>
                );
              })}
          </Grid>
        </Container>
      </>
    );
  }
};

export default AllUsers;
