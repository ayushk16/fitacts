import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { updateEvent } from '../../../features/dashboard/eventSlice';
const Events = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => {
    if (state.user) {
      return state.user;
    }
  });

  const eventsData = useSelector((state) => {
    if (state.events) {
      return state.events;
    }
  });

  const handleChangeEvent = ({ eventid, showintimeline }) => {
    // console.log({
    //   eventid,
    //   showintimeline,
    //   userid: userData.data.data.user.id,
    // });
    dispatch(
      updateEvent({
        eventid,
        showintimeline,
        userid: userData.data.data.user.id,
      })
    );
  };

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
                    <Typography>
                      on - {new Date(item.timestamp).toLocaleString()}
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.showintimeline}
                            onChange={(e) => {
                              handleChangeEvent({
                                eventid: item.eventid,
                                showintimeline: e.target.checked,
                              });
                            }}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        label="Show in timeline"
                      />
                    </FormGroup>
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
