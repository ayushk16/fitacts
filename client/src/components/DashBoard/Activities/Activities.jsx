import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../DashboardHeader';
import { fetchActivities } from '../../../features/dashboard/activities/activitiesSlice';
import { Container, Grid, Box } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Activity from './Activity';
const Activities = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('activities');
    dispatch(fetchActivities()).then((res) => {});
  }, []);

  const activitiesData = useSelector((state) => state.activities);
  if (activitiesData) {
    console.log(activitiesData);
  }
  // const userData = useSelector((state) => state.user);
  // if (userData.data) {
  //   console.log(userData);
  // }
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
        <Container sx={{ marginTop: 5 }}>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {activitiesData.data.map((item, index) => {
              return <Activity item={item} key={item.id} />;
            })}
          </Grid>
        </Container>
      </>
    );
  }
};

export default Activities;
