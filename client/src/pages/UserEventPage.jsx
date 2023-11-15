import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowedUserEvents } from '../features/user/followedUserEvents.js';
import { useParams } from 'react-router-dom';
import FollowedActivitiesShowCase from '../components/FollowedUser/FollowedActivitiesShowCase.jsx';

import DashboardHeader from '../components/DashboardHeader.jsx';
const UserEventPage = () => {
  const { userid } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(fetchFollowedUserEvents({ userId: userid }));
  });

  return (
    <>
      <DashboardHeader />
      <FollowedActivitiesShowCase userId={userid} />
    </>
  );
};

export default UserEventPage;
