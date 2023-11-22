import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../DashboardHeader';
import { fetchActivities } from '../../../features/dashboard/activities/activitiesSlice';
import { Container, Grid, Skeleton } from '@mui/material';
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
        <Container sx={{ marginTop: 5 }}>
          <Grid
            container
            rowSpacing={1.5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3} margin={2} height={'auto'}>
              <Skeleton variant="rectangular" width={'100%'} height={118} />
              <Skeleton />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} margin={2} height={'auto'}>
              <Skeleton variant="rectangular" width={'100%'} height={118} />
              <Skeleton />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} margin={2} height={'auto'}>
              <Skeleton variant="rectangular" width={'100%'} height={118} />
              <Skeleton />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }
  if (activitiesData.error !== null && activitiesData.error !== '') {
    return (
      <>
        <DashboardHeader />
        <Container sx={{ marginTop: 5 }}>
          <Grid
            container
            rowSpacing={1.5}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3} margin={2} height={'auto'}>
              Something went wrong
            </Grid>
          </Grid>
        </Container>
      </>
    );
  } else {
    return (
      <>
        <DashboardHeader />
        <Container sx={{ marginTop: 5 }}>
          <Grid
            container
            rowSpacing={1.5}
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
