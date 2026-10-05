import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Stack, Tabs, Tab, Box, Typography } from '@mui/material';
import { FaRss, FaUsers, FaUserCheck, FaUserClock, FaEnvelope } from 'react-icons/fa';

import DashboardHeader from '../components/DashboardHeader';
import SocialFeed from '../components/DashBoard/feed/SocialFeed';
import AllUsers from '../components/DashBoard/feed/AllUsers';
import FollowingUsers from '../components/DashBoard/feed/FollowingUsers';
import PendingUsers from '../components/DashBoard/feed/PendingUser';
import Requests from '../components/DashBoard/feed/Requests';

import { fetchUsers } from '../features/user/usersSlice';
import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';
import { fetchFollowing } from '../features/user/followingSlice';
import { fetchPending } from '../features/user/pendingSlice';
import { fetchRequest } from '../features/user/requestSlice';
import { useThemeMode } from '../theme/ThemeContext';
import { getUser } from '../functions/tokenSet';

const Feed = () => {
  const dispatch = useDispatch();
  const { mode } = useThemeMode();
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();

  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem('fitacts_feed_tab') || 'feed'
  );

  useEffect(() => {
    const effectiveUser = currentUser || getUser();
    if (effectiveUser?.id) {
      dispatch(fetchUsers({ currentUserId: effectiveUser.id }));
      dispatch(fetchActivities());
      dispatch(fetchFollowing({ userId: effectiveUser.id }));
      dispatch(fetchPending({ userId: effectiveUser.id }));
      dispatch(fetchRequest({ userId: effectiveUser.id }));
    }
  }, [dispatch, currentUser?.id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    localStorage.setItem('fitacts_feed_tab', newValue);
  };

  return (
    <>
      <DashboardHeader />
      <Box sx={{ bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: 'calc(100vh - 70px)', pt: 3 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                p: 0.5,
                borderRadius: 4,
                border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                '& .MuiTabs-indicator': {
                  height: '100%',
                  borderRadius: 3.5,
                  bgcolor: 'primary.main',
                  zIndex: 0,
                },
                '& .MuiTab-root': {
                  zIndex: 1,
                  minHeight: 44,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textTransform: 'none',
                  borderRadius: 3.5,
                  px: 2.5,
                  transition: 'color 0.2s',
                  '&.Mui-selected': {
                    color: '#ffffff',
                  },
                },
              }}
            >
              <Tab icon={<FaRss />} iconPosition="start" label="Feed" value="feed" />
              <Tab icon={<FaUsers />} iconPosition="start" label="All Users" value="all" />
              <Tab icon={<FaUserCheck />} iconPosition="start" label="Following" value="following" />
              <Tab icon={<FaEnvelope />} iconPosition="start" label="Requests" value="requests" />
              <Tab icon={<FaUserClock />} iconPosition="start" label="Pending" value="pending" />
            </Tabs>
          </Box>
        </Container>

        {activeTab === 'feed' && <SocialFeed onSwitchToAllUsers={() => setActiveTab('all')} />}
        {activeTab === 'all' && <AllUsers />}
        {activeTab === 'following' && <FollowingUsers />}
        {activeTab === 'requests' && <Requests />}
        {activeTab === 'pending' && <PendingUsers />}
      </Box>
    </>
  );
};

export default Feed;
