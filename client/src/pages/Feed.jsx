import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DashboardHeader from '../components/DashboardHeader';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Container, Stack } from '@mui/material';
import AllUsers from '../components/DashBoard/feed/AllUsers';
import FollowingUsers from '../components/DashBoard/feed/FollowingUsers';

import { fetchUsers } from '../features/user/usersSlice';
import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';
import { fetchFollowing } from '../features/user/followingSlice';

const Feed = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => {
    return state.user;
  });
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchActivities());
    userData &&
      userData.data &&
      dispatch(fetchFollowing({ userId: userData.data.data.user.id }));
  }, []);

  const [alignment, setAlignment] = useState(1);

  const handleChange = (event) => {
    setAlignment(event.target.value);
  };
  return (
    <>
      <DashboardHeader />
      <Container>
        <Stack display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={(e) => {
              handleChange(e);
            }}
            aria-label="Platform"
          >
            <ToggleButton value="1">All Users</ToggleButton>
            <ToggleButton value="2">Following</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Container>
      {
        {
          1: <AllUsers />,
          2: <FollowingUsers />,
        }[alignment]
      }
    </>
  );
};

export default Feed;
