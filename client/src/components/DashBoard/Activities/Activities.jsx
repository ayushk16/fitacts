import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../DashboardHeader';
import { fetchActivities } from '../../../features/dashboard/activities/activitiesSlice';
import { Container, Grid } from '@mui/material';
import { clearTopEvents } from '../../../features/dashboard/activities/topEvents/topEvents';

import Activity from './Activity';
const Activities = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(clearTopEvents());
  }, []);

  const activitiesData = useSelector((state) => state.activities);

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
              return <Activity item={item} key={item.id} data-id={item.id} />;
            })}
          </Grid>
        </Container>
      </>
    );
  }
};

export default Activities;
