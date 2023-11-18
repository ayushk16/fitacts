import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Container, Grid, Card, Box, Typography } from '@mui/material';
import {
  setFollowedUser,
  clearFollowedUser,
} from '../../../features/user/followedUserSlice';

const FollowingUsers = () => {
  const dispatch = useDispatch();
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
