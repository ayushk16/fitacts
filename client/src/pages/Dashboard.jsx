import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material';

import { getToken, getUser, removeUserToken } from '../functions/tokenSet.js';
import { login } from '../features/user/userSlice.js';

import DashboardHeader from '../components/DashboardHeader.jsx';
import Navheader from '../components/DashBoard/Timeline/Navheader.jsx';
import ActivitiesShowCase from '../components/DashBoard/Timeline/ActivitiesShowCase.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token && !user) {
      removeUserToken();
      navigate('/login');
    } else {
      dispatch(login({ data: { token: { accessToken: token }, user: user } }));
    }
  }, []);

  const userState = useSelector((state) => {
    if (state.user) {
      return state.user;
    }
  });

  if (userState.loading) {
    return (
      <>
        <DashboardHeader />
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
        <DashboardHeader />
        <Navheader />
        <ActivitiesShowCase />
      </>
    );
  }
};

export default Dashboard;
