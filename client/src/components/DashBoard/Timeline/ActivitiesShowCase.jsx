import React, { useEffect } from 'react';
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
      Navigate('/login');
    }
    dispatch(fetchEvents({ userid: user.id }));
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
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          marginTop={3}
          height={'auto'}
        >
          <Grid item></Grid>
          {eventsData.data &&
            eventsData.data.map((event, index) => {
              return (
                <Grid
                  item
                  key={event.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  height={'auto'}
                >
                  <Card sx={{ padding: '1rem' }}>
                    <Stack spacing={2} width={'100%'} alignItems={'center'}>
                      <Typography variant="h5">{event.name}</Typography>
                      <Stack
                        direction={'row'}
                        display="flex"
                        justifyContent="space-evenly"
                        spacing={2}
                        flexWrap={'wrap'}
                      >
                        <Box>
                          <Typography>distance - {event.distance}</Typography>
                        </Box>
                        <Box>
                          <Typography>duration - {event.duration}</Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </>
    );
  }
};

export default ActivitiesShowCase;
