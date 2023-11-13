import React, { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import {
  Box,
  MenuItem,
  Select,
  InputAdornment,
  FormHelperText,
  OutlinedInput,
  Stack,
  Typography,
  InputLabel,
  FormControl,
  Button,
  Menu,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';
import { json } from 'react-router-dom';
import Clock from '../components/DashBoard/Fitscale/Clock';
import DummyClock from '../components/DashBoard/Fitscale/DummyClock';

const Fitscale = () => {
  const dispatch = useDispatch();

  const [selectedActivity, setSelectedActivity] = useState({});
  const [displayClock, setDisplayClock] = useState(false);
  const [distanceEntered, setDistanceEntered] = useState({
    error: false,
    distance: 0,
  });

  useEffect(() => {
    console.log(distanceEntered);
  }, [distanceEntered]);

  useEffect(() => {
    console.log(selectedActivity);
  }, [selectedActivity]);

  useEffect(() => {
    console.log('activities');
    dispatch(fetchActivities()).then((res) => {});
  }, []);

  const activitiesData = useSelector((state) => state.activities);
  if (activitiesData) {
    console.log(activitiesData);
  }
  const userData = useSelector((state) => state.user);
  if (userData) {
    console.log(userData);
  }

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
  };

  return (
    <>
      <DashboardHeader />
      <Box
        sx={{ width: '100vw', bgcolor: 'grey', height: '100px' }}
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
                  const activity = activitiesData.data.find(
                    (activity) => activity.id === id
                  );
                  setSelectedActivity(() => activity);
                }}
              >
                {userData.data.data.user.favorites.map((item, index) => {
                  return (
                    <MenuItem value={item} key={item}>
                      {
                        activitiesData.data.find(
                          (activity) => activity.id === item
                        ).name
                      }
                    </MenuItem>
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
            {/* make astart counter button */}
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
    </>
  );
};

export default Fitscale;
