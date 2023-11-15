import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../DashboardHeader';
import { fetchTopEvents } from '../../../features/dashboard/activities/topEvents/topEvents';
import { Card, Container, Grid, Stack, Typography } from '@mui/material';

const TopFive = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopEvents({ id }));
  }, []);

  const topEventsData = useSelector((state) => {
    return state.topEvents;
  });

  if (topEventsData.loading) {
    return (
      <>
        <DashboardHeader />
        <div>loading</div>
      </>
    );
  }
  if (topEventsData.error !== null && topEventsData.error !== '') {
    return (
      <>
        <DashboardHeader />
        <div>error</div>
      </>
    );
  } else {
    return (
      <>
        <DashboardHeader />
        <Container>
          <Stack
            alignContent={'center'}
            position={'absolute'}
            left={0}
            justifyContent={'center'}
            width={'100vw'}
          >
            {!topEventsData.Data && topEventsData.data.length === 0 ? (
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '3rem',
                  textAlign: 'center',
                  marginTop: '2rem',
                }}
              >
                No Data Found...
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#000000',
                  marginBottom: '3rem',
                  textAlign: 'center',
                  marginTop: '2rem',
                }}
              >
                Top 5 Events
              </Typography>
            )}
            <Grid container spacing={2}>
              {topEventsData &&
                topEventsData.data.map((event, index) => {
                  return (
                    <>
                      <Grid
                        item
                        xs={12}
                        Key={event.eventid}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}
                      >
                        <Card sx={{ width: '50%', padding: '2rem' }}>
                          <div>
                            <Typography
                              sx={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#000000',
                                textAlign: 'center',
                              }}
                            >
                              {event.eventname}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              sx={{
                                fontSize: '1.3rem',
                                color: '#000000',
                                textAlign: 'center',
                                marginTop: '2rem',
                              }}
                            >
                              Activity - {event.activityname}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '1.3rem',
                                color: '#000000',
                                textAlign: 'center',
                                marginTop: '2rem',
                              }}
                            >
                              Distance - {event.distance}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '1.3rem',
                                color: '#000000',
                                textAlign: 'center',
                                marginTop: '2rem',
                              }}
                            >
                              Duration -{' '}
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
                          </div>
                        </Card>
                      </Grid>
                    </>
                  );
                })}
            </Grid>
          </Stack>
        </Container>
      </>
    );
  }
};

export default TopFive;
