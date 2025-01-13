import React, { useEffect, useState, useContext } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Container, Stack, Box } from '@mui/system';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button, Card, Modal, Typography, Backdrop } from '@mui/material';
import { useSpring, animated } from '@react-spring/web';

import { clearTopEvents } from '../features/dashboard/activities/topEvents/topEvents';
import { clearActivities } from '../features/dashboard/activities/activitiesSlice';
import { clearEvents } from '../features/dashboard/eventSlice';
import { clearFollowedUser } from '../features/user/followedUserSlice';
import { clearFollowing } from '../features/user/followingSlice';
import { cleanUp } from '../features/user/userSignupSlice';
import { logout } from '../features/user/userSlice';
import { clearUsers } from '../features/user/usersSlice';
import { clearPending } from '../features/user/pendingSlice';
import { clearRequest } from '../features/user/requestSlice';

import { useDispatch } from 'react-redux';

import { getUser, removeUserToken, getToken } from '../functions/tokenSet';
import { useNavigate } from 'react-router-dom';

import { SnackBarContext } from '../App.jsx';
import config from '../functions/config.js';

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = getUser();
  const token = getToken();

  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const [aadharData, setAadharData] = useState('');

  useEffect(() => {
    axios
      .get(config.API_BASE_URL + '/user/aadhar', {
        params: { userid: userData.id },
        headers: { ['x-access-token']: token },
      })
      .then((res) => {
        setAadharData(res.data);
      });
  }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <DashboardHeader />
      <Box
        style={{
          position: 'fixed',
          top: '100px',
          left: '100px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
        onClick={() => {
          navigate(-1);
        }}
      >
        <FaArrowLeft />
        <Typography>Go Back</Typography>
      </Box>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Stack
          direction="row"
          spacing={3}
          sx={{
            marginTop: '-200px',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Typography variant="h3" component={'h3'}>
              Your Profile
            </Typography>
            <Card
              sx={{
                width: '400px',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
                padding: '50px',
                background: 'linear-gradient(to top, #F9F5E7, #fff)',
                color: 'black',
              }}
            >
              <Stack direction="row" spacing={1}>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  Name
                </Typography>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  -
                </Typography>
                <Typography fontSize={25}>
                  {userData.firstname.charAt(0).toUpperCase() +
                    userData.firstname.slice(1) +
                    ' ' +
                    userData.lastname.charAt(0).toUpperCase() +
                    userData.lastname.slice(1)}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  Phone
                </Typography>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  -
                </Typography>
                <Typography fontSize={25}>{userData.phone}</Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  Email
                </Typography>
                <Typography
                  textAlign={'center'}
                  fontSize={25}
                  fontWeight={'600'}
                >
                  -
                </Typography>
                <Typography textAlign={'center'} fontSize={25}>
                  {userData.email}
                </Typography>
              </Stack>
              {userData.aadharpresent === true ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpen}
                >
                  View your Aadhar data
                </Button>
              ) : (
                <Typography fontSize={15} color={'error'}>
                  Your Aadhar is not Uploaded
                </Typography>
              )}
              <Button
                variant="contained"
                color="error"
                onClick={(e) => {
                  removeUserToken();
                  handleOpenSnackBar('Logged out');
                  dispatch(clearTopEvents());
                  dispatch(clearActivities());
                  dispatch(clearEvents());
                  dispatch(clearFollowedUser());
                  dispatch(clearPending());
                  dispatch(clearRequest());
                  dispatch(clearFollowing());
                  dispatch(clearUsers());
                  dispatch(cleanUp());
                  dispatch(logout());
                  localStorage.removeItem('feedallignment');
                  navigate('/login');
                }}
              >
                Logout
              </Button>
            </Card>
          </div>
        </Stack>{' '}
      </Container>
      {userData.aadharpresent === true && aadharData.data ? (
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="spring-modal-title" variant="h6" component="h2">
                storageinfo
              </Typography>
              <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                {aadharData.data.storageinfo}
              </Typography>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  );
};

export default Profile;
