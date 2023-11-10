import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const state = useSelector((state) => state.currentUser);
  console.log(state);

  return <></>;
};

export default Dashboard;
