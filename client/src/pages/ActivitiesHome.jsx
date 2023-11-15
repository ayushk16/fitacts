import React from 'react';

import { useSelector } from 'react-redux';
import Activities from '../components/DashBoard/Activities/Activities.jsx';
import AadharUpload from '../components/DashBoard/aadharUpload/AadharUpload.jsx';

const ActivitiesHome = () => {
  const userState = useSelector((state) => {
    if (state.user) {
      return state.user;
    }
  });

  if (userState.loading) {
    return (
      <>
        <Skeleton />
        <Skeleton />
      </>
    );
  }
  if (userState.error !== null && userState.error !== '') {
    return <div>error-{userState.error}</div>;
  }
  if (userState.data) {
    return (
      <>
        {userState.data && userState.data.data.user.aadharpresent ? (
          <Activities />
        ) : (
          <AadharUpload userid={userState.data.data.user.id} />
        )}
      </>
    );
  }
};

export default ActivitiesHome;
