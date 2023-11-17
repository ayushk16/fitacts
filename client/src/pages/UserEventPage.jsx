import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowedUserEvents } from '../features/user/followedUserEvents.js';
import { useParams } from 'react-router-dom';
import FollowedActivitiesShowCase from '../components/FollowedUser/FollowedActivitiesShowCase.jsx';

import DashboardHeader from '../components/DashboardHeader.jsx';
const UserEventPage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const followedUserData = useSelector((state) => state.followedUser);
  useEffect(() => {
    if (followedUserData.data) {
      dispatch(fetchFollowedUserEvents({ userId: followedUserData.data.id }));
    }
  }, [followedUserData]);

  return (
    <>
      <DashboardHeader />
      {followedUserData.data && (
        <FollowedActivitiesShowCase
          userId={followedUserData.data.id}
          username={followedUserData.data.name}
        />
      )}
    </>
  );
};

export default UserEventPage;
