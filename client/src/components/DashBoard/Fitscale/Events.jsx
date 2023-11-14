import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, Container, Grid, Typography } from '@mui/material';
const Events = () => {
  const eventsData = useSelector((state) => {
    if (state.events) {
      return state.events;
    }
  });

  return (
    <>
      <Container sx={{ marginTop: 5 }}>
        <Grid
          container
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          marginTop={3}
        >
          {eventsData.data.map((item, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      Event - {item.eventname}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="h2">
                      Activity - {item.activityname}
                    </Typography>
                    <Typography>
                      distance - {item.distance}
                      {item.distanceunit}
                    </Typography>
                    <Typography>duration - {item.duration}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default Events;
