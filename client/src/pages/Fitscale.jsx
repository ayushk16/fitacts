import React, { useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import {
  Box,
  MenuItem,
  Select,
  Stack,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';

const Fitscale = () => {
  const dispatch = useDispatch();

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
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default Fitscale;
