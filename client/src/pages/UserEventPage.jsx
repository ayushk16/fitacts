import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Skeleton, Box } from '@mui/material';

import FollowedActivitiesShowCase from '../components/FollowedUser/FollowedActivitiesShowCase.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import config from '../functions/config.js';
import { getUser } from '../functions/tokenSet.js';

const UserEventPage = () => {
  const { username } = useParams();
  const followedUserData = useSelector((state) => state.followedUser);
  const [profileUser, setProfileUser] = useState(followedUserData?.data || null);
  const [loading, setLoading] = useState(!followedUserData?.data && Boolean(username));

  useEffect(() => {
    if (!profileUser && username) {
      const currentUser = getUser();
      axios
        .get(`${config.API_BASE_URL}/user/profile/${username}`, {
          params: { currentUserId: currentUser?.id },
        })
        .then((res) => {
          if (res.data?.data) {
            setProfileUser({
              id: res.data.data.id,
              name: `${res.data.data.firstname} ${res.data.data.lastname}`,
            });
          }
        })
        .catch((err) => console.error('Error fetching user for events page:', err))
        .finally(() => setLoading(false));
    }
  }, [username, profileUser]);

  return (
    <>
      <DashboardHeader />
      {loading ? (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={300} />
        </Container>
      ) : profileUser ? (
        <FollowedActivitiesShowCase
          userId={profileUser.id}
          username={profileUser.name || username}
        />
      ) : (
        <Container maxWidth="sm" sx={{ mt: 5, textAlign: 'center' }}>
          User not found.
        </Container>
      )}
    </>
  );
};

export default UserEventPage;
