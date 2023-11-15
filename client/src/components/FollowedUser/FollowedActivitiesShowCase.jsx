import React from 'react';
import { useSelector } from 'react-redux';

import { Card, Grid, Stack, Typography } from '@mui/material';

const FollowedActivitiesShowCase = () => {
  const eventsData = useSelector((state) => state.followedUserEvents);
  if (eventsData.loading) {
    return <div>loading</div>;
  }
  if (eventsData.error !== null && eventsData.error !== '') {
    return <div>error fetching events</div>;
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
                      <Card sx={{ padding: '1rem', position: 'relative' }}>
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

export default FollowedActivitiesShowCase;
