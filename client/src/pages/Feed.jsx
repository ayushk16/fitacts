import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Container, Stack } from '@mui/material';

import DashboardHeader from '../components/DashboardHeader';
import AllUsers from '../components/DashBoard/feed/AllUsers';
import FollowingUsers from '../components/DashBoard/feed/FollowingUsers';
import PendingUsers from '../components/DashBoard/feed/PendingUser';
import Requests from '../components/DashBoard/feed/Requests';

import { fetchUsers } from '../features/user/usersSlice';
import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';
import { fetchFollowing } from '../features/user/followingSlice';
import { clearFollowedUser } from '../features/user/followedUserSlice';
import { fetchPending } from '../features/user/pendingSlice';
import { clearPendingUser } from '../features/user/pendingUserSlice';
import { fetchRequest } from '../features/user/requestSlice';

const Feed = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => {
    return state.user;
  });
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchActivities());
    dispatch(clearFollowedUser());
    dispatch(clearPendingUser());
    userData &&
      userData.data &&
      dispatch(fetchFollowing({ userId: userData.data.data.user.id }))
        .then(dispatch(fetchPending({ userId: userData.data.data.user.id })))
        .then(dispatch(fetchRequest({ userId: userData.data.data.user.id })));
  }, []);

  const [alignment, setAlignment] = useState(
    localStorage.getItem('feedallignment') || '1'
  );

  const handleChange = (event) => {
    setAlignment(event.target.value);
    localStorage.setItem('feedallignment', event.target.value);
  };
  return (
    <>
      <DashboardHeader />
      <Container>
        <Stack display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={(e) => {
              handleChange(e);
            }}
            aria-label="Platform"
          >
            <ToggleButton value="1">All Users</ToggleButton>
            <ToggleButton value="2">Pending</ToggleButton>
            <ToggleButton value="3">Following</ToggleButton>
            <ToggleButton value="4">Requests</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Container>
      {
        {
          1: <AllUsers />,
          2: <PendingUsers />,
          3: <FollowingUsers />,
          4: <Requests />,
        }[alignment]
      }
    </>
  );
};

export default Feed;
