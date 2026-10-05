import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Skeleton, Container, Box } from '@mui/material';

import { getToken, getUser, removeUserToken } from '../functions/tokenSet.js';
import { login } from '../features/user/userSlice.js';
import { fetchEvents } from '../features/dashboard/eventSlice.js';

import DashboardHeader from '../components/DashboardHeader.jsx';
import UserWelcome from '../components/DashBoard/Timeline/UserWelcome.jsx';
import ActivitiesShowCase from '../components/DashBoard/Timeline/ActivitiesShowCase.jsx';
import { useThemeMode } from '../theme/ThemeContext.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useThemeMode();

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();
  const token = getToken();

  useEffect(() => {
    if (!token && !currentUser) {
      removeUserToken();
      navigate('/login');
      return;
    }

    if (currentUser?.id) {
      dispatch(fetchEvents({ userid: currentUser.id }));
    }
  }, [currentUser?.id, token, dispatch, navigate]);

  if (!currentUser) {
    return (
      <>
        <DashboardHeader />
        <Container sx={{ mt: 4 }}>
          <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />
          <Skeleton variant="rounded" height={260} />
        </Container>
      </>
    );
  }

  return (
    <Box sx={{ bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: 'calc(100vh - 70px)' }}>
      <DashboardHeader />
      <UserWelcome />
      <ActivitiesShowCase />
    </Box>
  );
};

export default Dashboard;
