import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Skeleton } from '@mui/material';
import Activities from '../components/DashBoard/Activities/Activities.jsx';
import AadharUpload from '../components/DashBoard/aadharUpload/AadharUpload.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import { getUser, getToken } from '../functions/tokenSet.js';

const ActivitiesHome = () => {
  const navigate = useNavigate();

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();
  const token = getToken();

  useEffect(() => {
    if (!token && !currentUser) {
      navigate('/login');
    }
  }, [currentUser?.id, token, navigate]);

  if (!currentUser) {
    return (
      <>
        <DashboardHeader />
        <Container sx={{ mt: 5 }}>
          <Skeleton variant="rounded" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={300} />
        </Container>
      </>
    );
  }

  const hasAadhaar = Boolean(
    currentUser.aadharpresent === true ||
    currentUser.aadharpresent === 1 ||
    currentUser.aadharpresent === 'true'
  );

  return (
    <>
      {hasAadhaar ? (
        <Activities />
      ) : (
        <AadharUpload userid={currentUser.id} />
      )}
    </>
  );
};

export default ActivitiesHome;
