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
} from '@mui/material';

import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';

import Clock from '../components/DashBoard/Fitscale/Clock';
import Events from '../components/DashBoard/Fitscale/Events';
import DummyClock from '../components/DashBoard/Fitscale/DummyClock';
import DashboardHeader from '../components/DashboardHeader';
import EventsTable from '../components/DashBoard/Fitscale/EventsTable';

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
    setSelectedActivity({});
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
        <div>loading</div>
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
          sx={{ width: '100vw', bgcolor: 'lightblue', height: '100px' }}
          padding={'2rem'}
        >
          <Stack
            display="flex"
            justifyContent="center"
            spacing={5}
            direction="row"
            alignContent="center"
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
        {/* <Events /> */}
      </>
    );
  }
};

export default Fitscale;
