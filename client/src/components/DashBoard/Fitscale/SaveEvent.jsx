import React, { useState, useEffect } from 'react';

import { Modal, Box, Grid, Button, TextField } from '@mui/material';

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
  const [eventName, seteventName] = useState('');

  console.log(distance, activity, time);
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
                resetTimer();
                clearActivityAndDistance();
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