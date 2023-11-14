import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../../features/dashboard/eventSlice.js';
import { getUser } from '../../../functions/tokenSet.js';
import { removeUserToken } from '../../../functions/tokenSet.js';

const ActivitiesShowCase = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const UserData = useSelector((state) => {
    if (state.user.data.data) {
      return state.user.data.data.user;
    }
  });

  useEffect(() => {
    const user = getUser();
    if (!user) {
      removeUserToken();
      navigate('/login');
    } else {
      dispatch(fetchEvents({ userid: user.id }));
    }
  }, [UserData]);

  const eventsData = useSelector((state) => {
    if (state.events) {
      return state.events;
    }
  });

  if (eventsData.loading) {
    const tempArr = [1, 2, 3];
    return (
      <>
        <Container sx={{ marginTop: 5 }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            marginTop={3}
          >
            {tempArr.map((item, index) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  height={100}
                  key={index}
                >
                  <Box>
                    <Skeleton variant="wave"></Skeleton>
                    <Skeleton variant="wave"></Skeleton>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </>
    );
  }
  if (eventsData.error !== null) {
    return (
      <Container sx={{ marginTop: 5 }}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          marginTop={3}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} height={100}>
            <Box>
              <Typography variant="h4" component="h5" color="error">
                {eventsData.error === 'Request failed with status code 404'
                  ? 'ERROR FETCHING EVENTS'
                  : 'NO EVENTS AVAILABLE'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    return (
      <>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 3, sm: 2, md: 3 }}
          marginTop={3}
          height={'auto'}
        >
          {eventsData.data &&
            eventsData.data.map((event, index) => {
              return (
                <>
                  {event.showintimeline === true && (
                    <Grid key={event.id} item xs={3} height={'auto'}>
                      <Card sx={{ padding: '1rem' }}>
                        <Stack spacing={2} width={'100%'} alignItems={'center'}>
                          <Typography variant="h5">
                            {event.eventname}
                          </Typography>
                          <Stack
                            direction={'column'}
                            display="flex"
                            justifyContent="space-evenly"
                            spacing={2}
                          >
                            <Typography>activity - {event.name}</Typography>

                            <Typography>
                              distance - {event.distance}
                              {event.distanceunit}
                            </Typography>

                            <Typography>
                              duration -{' '}
                              {Math.floor(event.duration / 3600) < 10
                                ? `0${Math.floor(event.duration / 3600)}`
                                : `${Math.floor(event.duration / 3600)}`}
                              :
                              {Math.floor((event.duration % 3600) / 60) < 10
                                ? `0${Math.floor((event.duration % 3600) / 60)}`
                                : `${Math.floor((event.duration % 3600) / 60)}`}
                              :
                              {Math.floor((event.duration % 3600) % 60) < 10
                                ? `0${Math.floor((event.duration % 3600) % 60)}`
                                : `${Math.floor((event.duration % 3600) % 60)}`}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Card>
                    </Grid>
                  )}
                </>
              );
            })}
        </Grid>
      </>
    );
  }
};

export default ActivitiesShowCase;
