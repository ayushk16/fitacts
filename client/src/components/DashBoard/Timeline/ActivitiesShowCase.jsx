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
import { TiDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  updateEvent,
} from '../../../features/dashboard/eventSlice.js';
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

  const removeFromTimeline = (event) => {
    dispatch(updateEvent(event));
  };

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
                <React.Fragment key={index}>
                  {event.showintimeline === true && (
                    <Grid key={event.id} item xs={12} height={'auto'}>
                      <Stack
                        sx={{
                          minWidth: '400px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '1rem',
                        }}
                      >
                        <Card
                          elevation={3}
                          style={{
                            padding: '1rem',
                            position: 'relative',
                            width: '400px',
                            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.45)',
                            background:
                              'linear-gradient(to top, #F9F5E7, #fff)',
                          }}
                        >
                          <Box position={'absolute'} right={20}>
                            <TiDeleteOutline
                              fontSize={24}
                              onClick={() => {
                                removeFromTimeline({
                                  userid: event.userid,
                                  eventid: event.eventid,
                                  showintimeline: false,
                                });
                              }}
                            />
                          </Box>

                          <Stack
                            spacing={2}
                            width={'100%'}
                            alignItems={'center'}
                          >
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
                                  ? `0${Math.floor(
                                      (event.duration % 3600) / 60
                                    )}`
                                  : `${Math.floor(
                                      (event.duration % 3600) / 60
                                    )}`}
                                :
                                {Math.floor((event.duration % 3600) % 60) < 10
                                  ? `0${Math.floor(
                                      (event.duration % 3600) % 60
                                    )}`
                                  : `${Math.floor(
                                      (event.duration % 3600) % 60
                                    )}`}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Card>
                      </Stack>
                    </Grid>
                  )}
                </React.Fragment>
              );
            })}
        </Grid>
      </>
    );
  }
};

export default ActivitiesShowCase;
