import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Grid, Button, TextField } from '@mui/material';

import { addEvent } from '../../../features/dashboard/eventSlice';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const SaveEvent = ({
  distance,
  activity,
  time,
  open,
  clearActivityAndDistance,
  resetTimer,
  handleClose,
  handleOpen,
}) => {
  const dispatch = useDispatch();
  const [eventName, seteventName] = useState('');
  const userData = useSelector((state) => {
    if (state.user.data.data) {
      return state.user.data.data.user;
    }
  });

  const save = () => {
    dispatch(
      addEvent({
        name: eventName,
        userid: userData.id,
        activityid: activity.id,
        distance: distance.distance,
        duration: time.hours * 3600 + time.minutes * 60 + time.seconds,
      })
    ).then((res) => {
      seteventName('');
      clearActivityAndDistance();
      resetTimer();
      handleClose();
    });
  };

  return (
    <>
      <div>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <Grid container>
              <Grid item xs={12}>
                <h1>Event Details</h1>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <h3>Event Name</h3>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-multiline-flexible"
                    label="Multiline"
                    multiline
                    onChange={(e) => {
                      seteventName(e.target.value);
                    }}
                    maxRows={4}
                    variant="standard"
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <h3>Activity</h3>
                </Grid>
                <Grid item xs={6}>
                  <h3>{activity.name}</h3>
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <h3>Distance</h3>
                </Grid>
                <Grid item xs={6}>
                  <h3>{distance.distance}</h3>
                </Grid>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={6}>
                  <h3>Time</h3>
                </Grid>
                <Grid item xs={6}>
                  <h3>{`${time.hours}:${time.minutes}:${time.seconds}`}</h3>
                </Grid>
              </Grid>
            </Grid>
            <Button
              disabled={eventName === '' ? true : false}
              onClick={() => {
                save();
                // resetTimer();
                // clearActivityAndDistance();
              }}
              sx={{ marginRight: '1rem' }}
              variant="contained"
            >
              save
            </Button>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default SaveEvent;
