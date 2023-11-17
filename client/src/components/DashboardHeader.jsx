import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { AiOutlineHome } from 'react-icons/ai';
import { getUser, removeUserToken, getToken } from '../functions/tokenSet';
import { FaUser } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { login } from '../features/user/userSlice.js';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = getUser();
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
  if (userData) {
    return (
      <>
        <AppBar position="sticky" sx={{ bgcolor: '#A7727D' }}>
          <Box position="sticky" top={0} sx={{ bgcolor: '#A7727D' }}>
            <Toolbar sx={{ justifyContent: 'center' }}>
              <Box
                onClick={() => {
                  navigate('/dashboard/timeline');
                }}
                sx={{
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  left: '20px',
                }}
              >
                <Typography variant="h5" noWrap component="div">
                  <NavLink
                    to={'/dashboard/timeline'}
                    style={({ isActive }) => ({
                      textDecoration: 'none',
                      color: isActive ? '#EDDBC7' : 'black',
                      width: '100%',
                      fontSize: '1.5rem',
                      textAlign: 'center',
                    })}
                  >
                    <AiOutlineHome className="home-icon" />
                  </NavLink>
                </Typography>
              </Box>
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '100%',
                  }}
                >
                  <NavLink
                    to={'/dashboard/activities'}
                    style={({ isActive }) => ({
                      textDecoration: 'none',
                      color: isActive ? '#EDDBC7' : 'black',
                      width: '100%',
                      fontSize: '1.3rem',
                      textAlign: 'center',
                    })}
                  >
                    Activities
                  </NavLink>
                </div>
                <NavLink
                  to={'/dashboard/fitscale'}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#EDDBC7' : 'black',
                    width: '100%',
                    fontSize: '1.3rem',
                    textAlign: 'center',
                  })}
                >
                  Fitscale
                </NavLink>
                <NavLink
                  to={'/dashboard/feed'}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#EDDBC7' : 'black',
                    width: '100%',
                    fontSize: '1.3rem',
                    textAlign: 'center',
                  })}
                >
                  Community
                </NavLink>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  position: 'absolute',
                  right: '20px',
                }}
              >
                <Typography
                  onClick={() => {
                    navigate(`/profile/${userData.firstname}`);
                  }}
                  variant="h6"
                  noWrap
                  component="div"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {`${userData.firstname + ' ' + userData.lastname} `}{' '}
                  <FaUser />
                </Typography>
              </Stack>
            </Toolbar>
          </Box>
        </AppBar>
      </>
    );
  }
};

export default DashboardHeader;
