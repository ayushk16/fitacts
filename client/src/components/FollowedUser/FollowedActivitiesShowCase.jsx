import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { FaArrowLeft } from 'react-icons/fa';
import { Card, Grid, Stack, Typography, Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';

const FollowedActivitiesShowCase = ({ userId, username }) => {
  const navigate = useNavigate();

  const [eventsData, setEventsData] = useState({ data: [] });
  const [continueLoading, setContinueLoading] = useState(true);
  const [pageloading, setPageloading] = useState(false);
  const [currentpagelength, setCurrentpagelength] = useState(0);
  const [totallength, setTotallength] = useState(0);

  useEffect(() => {
    axios
      .get('http://localhost:3000/events/breakdown', {
        params: { id: userId, limit: 5, offset: 0 },
      })
      .then((res) => {
        setEventsData((prev) => {
          return { ...prev, data: res.data.data.events };
        });
        setTotallength(res.data.data.length);
        setCurrentpagelength(res.data.data.events.length);
      });
  }, []);

  useEffect(() => {
    if (currentpagelength <= 5) return;
    console.log('fetching more data');
    setPageloading(true);
    axios
      .get('http://localhost:3000/events/breakdown', {
        params: { id: userId, limit: 2, offset: currentpagelength - 2 },
      })
      .then((res) => {
        if (res.data.data.events.length === 0) {
          setContinueLoading(false);
        } else {
          if (
            eventsData.data.filter((event) => {
              event.id === res.data.data.events[0].id;
            }).length > 0
          ) {
            return;
          } else {
            setEventsData((prev) => {
              return { ...prev, data: [...prev.data, ...res.data.data.events] };
            });
          }
        }
      });
    setPageloading(false);
  }, [currentpagelength]);

  const handleInfiniteScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        if (currentpagelength < totallength) {
          setCurrentpagelength((prev) => prev + 2);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll);
    return () => window.removeEventListener('scroll', handleInfiniteScroll);
  }, [continueLoading, eventsData.data.length, totallength]);

  if (eventsData.data) {
    return (
      <>
        <Box
          style={{
            position: 'fixed',
            top: '100px',
            left: '100px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <FaArrowLeft />
          <Typography>Go Back</Typography>
        </Box>
        <Typography
          sx={{
            fontSize: '2rem',
            color: '#000000',
            marginBottom: '2rem',
            textAlign: 'center',
            marginTop: '2rem',
          }}
        >
          {username}'s Timeline
        </Typography>

        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 3, sm: 2, md: 3 }}
          marginTop={3}
          height={'auto'}
        >
          {eventsData.data && eventsData.data.length === 0 ? (
            <Grid item xs={12}>
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
                No Data Found
              </Typography>
            </Grid>
          ) : (
            eventsData.data &&
            eventsData.data.map((event, index) => {
              return (
                <React.Fragment key={index}>
                  {event.showintimeline === true && (
                    <Grid item xs={12} key={index} height={'auto'}>
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
                            background:
                              'linear-gradient(to top, #F9F5D7, #fff)',
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
                </React.Fragment>
              );
            })
          )}
        </Grid>
        {pageloading && <div>loading more data...</div>}
      </>
    );
  }
};
// };

export default FollowedActivitiesShowCase;
