import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Card, Grid, Stack, Typography } from '@mui/material';
import { fetchAgain } from '../../features/user/followedUserEvents';

const FollowedActivitiesShowCase = ({ userId }) => {
  const dispatch = useDispatch();
  const [pageloading, setPageloading] = useState(false);
  const eventsData = useSelector((state) => state.followedUserEvents);

  const handleInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPageloading(true);
        console.log('fetching more data');
        dispatch(fetchAgain({ userId })).then(setPageloading(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  });

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
                    <Grid item xs={12} key={event.id} height={'auto'}>
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
                          sx={{
                            padding: '1rem',
                            position: 'relative',
                            width: '400px',
                          }}
                        >
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
                </>
              );
            })}
        </Grid>
        {pageloading && <div>loading more data...</div>}
      </>
    );
  }
};

export default FollowedActivitiesShowCase;
