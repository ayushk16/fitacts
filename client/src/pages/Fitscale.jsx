import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  MenuItem,
  Select,
  InputAdornment,
  FormHelperText,
  OutlinedInput,
  Stack,
  InputLabel,
  FormControl,
  Button,
  Skeleton,
} from '@mui/material';

import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';

import Clock from '../components/DashBoard/Fitscale/Clock';
import DummyClock from '../components/DashBoard/Fitscale/DummyClock';
import DashboardHeader from '../components/DashboardHeader';
import EventsTable from '../components/DashBoard/Fitscale/EventsTable';
import { Container } from '@mui/system';

const Fitscale = () => {
  const dispatch = useDispatch();

  const [selectedActivity, setSelectedActivity] = useState({});
  const [displayClock, setDisplayClock] = useState(false);
  const [distanceEntered, setDistanceEntered] = useState({
    error: false,
    distance: 0,
  });

  useEffect(() => {
    dispatch(fetchActivities());
  }, []);

  const activitiesData = useSelector((state) => state.activities);

  const userData = useSelector((state) => state.user);

  const checkDistanceField = (values) => {
    const value = parseInt(values);
    if (value > 0 && value < Number.MAX_SAFE_INTEGER && !isNaN(value)) {
      setDistanceEntered((prev) => {
        return { ...prev, error: false, distance: parseInt(value) };
      });
    } else {
      setDistanceEntered((prev) => {
        return { ...prev, error: true };
      });
    }
  };
  const clearActivityAndDistance = () => {
    // setSelectedActivity({});
    setDistanceEntered({
      error: false,
      distance: 0,
    });
    setDisplayClock(false);
  };

  if (activitiesData.loading) {
    return (
      <>
        <DashboardHeader />
        <Container>
          <Stack alignContent={'center'} justifyContent={'center'}>
            <Skeleton variant="rectangular" width={'100%'} height={118} />
            <Skeleton />
          </Stack>
        </Container>
      </>
    );
  }

  if (activitiesData.error !== null && activitiesData.error !== '') {
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
        <Box
          sx={{ width: '100vw', bgcolor: '#EDDBC7', height: 'auto' }}
          padding={'2rem'}
        >
          <Stack
            display="flex"
            spacing={5}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="activities">activities</InputLabel>
                <Select
                  labelId="activities"
                  id="fitscale-favorite-activities"
                  label="Activities"
                  onChange={(e) => {
                    const id = e.target.value;
                    const activity =
                      activitiesData.data &&
                      activitiesData.data.find(
                        (activity) => activity.id === id
                      );
                    setSelectedActivity(() => activity);
                  }}
                >
                  {activitiesData.data.map((item, index) => {
                    return userData.data.data.user.favorites.map(
                      (favitem, index) => {
                        if (favitem === item.id) {
                          return (
                            <MenuItem value={item.id} key={item.id}>
                              {item.name}
                            </MenuItem>
                          );
                        }
                      }
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ minWidth: 80 }}>
              <FormControl sx={{ m: 1, width: '15ch' }} variant="outlined">
                <OutlinedInput
                  disabled={selectedActivity.name ? false : true}
                  id="outlined-adornment-distance"
                  defaultValue={distanceEntered.distance}
                  onChange={(e) => {
                    checkDistanceField(e.target.value);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      {selectedActivity.distanceunit}
                    </InputAdornment>
                  }
                  aria-describedby="outlined-distance-helper-text"
                  inputProps={{
                    'aria-label': 'distance',
                  }}
                />
              </FormControl>
              {
                <FormHelperText id="outlined-distance-helper-text">
                  {distanceEntered.error
                    ? 'Please enter a valid distance'
                    : 'Enter distance'}
                </FormHelperText>
              }
            </Box>
            <Box>
              {
                <Button
                  variant="contained"
                  disabled={
                    distanceEntered.error || distanceEntered.distance === 0
                  }
                  style={
                    distanceEntered.error || distanceEntered.distance === 0
                      ? {
                          backgroundColor: '#A7727D',
                          color: '#FAFDD6',
                          opacity: '0.5',
                        }
                      : { backgroundColor: '#A7727D', color: '#FAFDD6' }
                  }
                  onClick={() => {
                    setDisplayClock(true);
                  }}
                >
                  Select
                </Button>
              }
            </Box>
          </Stack>
        </Box>
        {displayClock && !distanceEntered.error ? (
          <Clock
            clearActivityAndDistance={clearActivityAndDistance}
            distance={distanceEntered}
            activity={selectedActivity}
          />
        ) : (
          <DummyClock />
        )}
        <EventsTable />
      </>
    );
  }
};

export default Fitscale;
