import React from 'react';
import { useSelector } from 'react-redux';

import FollowedActivitiesShowCase from '../components/FollowedUser/FollowedActivitiesShowCase.jsx';

import DashboardHeader from '../components/DashboardHeader.jsx';
const UserEventPage = () => {
  const followedUserData = useSelector((state) => state.followedUser);

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
