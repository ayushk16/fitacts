import React, { useEffect, useState, createContext } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ActivitiesHome from './pages/ActivitiesHome';
import Fitscale from './pages/Fitscale';
import TopFive from './components/DashBoard/Activities/TopFive';
import Feed from './pages/Feed';
import UserEventPage from './pages/UserEventPage';
import Profile from './pages/Profile';
import OtherUserProfile from './pages/OtherUserProfile';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackBarContext = createContext();
function App() {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const handleOpenSnackBar = (message) => {
    setSnackBarMessage(message);
    setSnackBarOpen(true);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackBarOpen(false);
  };
  return (
    <>
      <SnackBarContext.Provider
        value={{ handleOpenSnackBar, handleCloseSnackBar }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard/timeline" element={<Dashboard />} />
          <Route path="/dashboard/activities" element={<ActivitiesHome />} />
          <Route path="/dashboard/fitscale" element={<Fitscale />} />
          <Route path="/dashboard/activities/:id" element={<TopFive />} />
          <Route path="/dashboard/feed/" element={<Feed />} />
          <Route path="/events/:username" element={<UserEventPage />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/dashboard/feed/user/" element={<OtherUserProfile />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackBar}
        >
          <Alert onClose={handleCloseSnackBar} severity="success">
            {snackBarMessage}
          </Alert>
        </Snackbar>
      </SnackBarContext.Provider>
    </>
  );
}

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard/timeline');
  }, []);

  return <div>Redirecting...</div>;
}

export default App;
