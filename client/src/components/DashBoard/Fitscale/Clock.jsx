import { Container, Stack, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import SaveEvent from './SaveEvent';

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

const Clock = ({ clearActivityAndDistance, distance, activity }) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const startTimer = () => {
    setTimerOn(true);
  };

  const stopTimer = () => {
    setTimerOn(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
  };

  useEffect(() => {
    let interval = null;
    if (timerOn) {
      interval = setInterval(() => {
        if (seconds === 60) {
          setMinutes((prev) => prev + 1);
          setSeconds(0);
        }
        if (minutes === 60) {
          setHours((prev) => prev + 1);
          setMinutes(0);
        }
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerOn, seconds, minutes, hours]);

  return (
    <>
      <Container>
        <Stack
          sx={{
            minHeight: '300px',
            minWidth: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            direction: 'column',
          }}
        >
          <Stack direction="column" justifyContent="center">
            <Typography disabled variant="h1" color={'GrayText'}>
              {hours < 10 ? `0${hours}` : hours}:
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </Typography>

            <Stack direction="row" justifyContent="center" spacing={2}>
              {timerOn ? (
                <Button variant="contained" onClick={stopTimer}>
                  pause
                </Button>
              ) : (
                <Button variant="contained" onClick={startTimer}>
                  Start
                </Button>
              )}
              <Button variant="contained" onClick={resetTimer}>
                Reset
              </Button>
            </Stack>
            <Stack>
              {!timerOn && (seconds > 0 || minutes > 0 || hours > 0) && (
                <Button sx={{ fontSize: '1.2rem' }} onClick={handleOpen}>
                  Save
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <SaveEvent
        distance={distance}
        activity={activity}
        time={{
          hours: hours,
          minutes: minutes,
          seconds: seconds,
        }}
        clearActivityAndDistance={clearActivityAndDistance}
        resetTimer={resetTimer}
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
    </>
  );
};

export default Clock;
