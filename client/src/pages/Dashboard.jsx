import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getToken, getUser, removeUserToken } from '../functions/tokenSet.js';
import DashboardHeader from '../components/DashboardHeader.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = getToken();
  useEffect(() => {
    const token = getToken();
    if (!token) {
      removeUserToken();
      navigate('/login');
    }
  });
  const state = useSelector((state) => state.currentUser);
  console.log(state);

  return (
    <>
      <DashboardHeader />
      <div>dashboard</div>
    </>
  );
};

export default Dashboard;
