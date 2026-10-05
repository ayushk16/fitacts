import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Box,
  Typography,
  Button,
  Skeleton,
  Stack,
  Avatar,
} from '@mui/material';
import { accept, reject, fetchRequest } from '../../../features/user/requestSlice';
import { SnackBarContext } from '../../../App.jsx';
import { useThemeMode } from '../../../theme/ThemeContext';

import { getUser } from '../../../functions/tokenSet';

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const requestsData = useSelector((state) => state.request);
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const userData = reduxUser || getUser();

  React.useEffect(() => {
    if (userData?.id) {
      dispatch(fetchRequest({ userId: userData.id }));
    }
  }, [dispatch, userData?.id]);

  if (requestsData.loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {[1, 2].map((n) => (
          <Skeleton key={n} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 3 }} />
        ))}
      </Container>
    );
  }

  const requestsList = requestsData.data || [];

  return (
    <Container maxWidth="md" sx={{ mt: 3, pb: 8 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2.5 }}>
        Friend Requests ({requestsList.length})
      </Typography>

      {requestsList.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No incoming friend requests right now.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {requestsList.map((user) => (
            <Grid item xs={12} key={user.id}>
              <Card
                sx={{
                  p: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                  bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                  borderRadius: 3.5,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${user.username || user.firstname}`)}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: mode === 'dark' ? '#6366f1' : '#4f46e5',
                      fontWeight: 700,
                    }}
                  >
                    {user.firstname?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {user.firstname} {user.lastname}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      @{user.username || user.firstname.toLowerCase()}
                    </Typography>
                  </Box>
                </Box>

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ borderRadius: 2.5 }}
                    onClick={() => {
                      if (!userData) return;
                      dispatch(
                        reject({
                          userId: userData.id,
                          followerId: user.id,
                        })
                      ).then(() => handleOpenSnackBar('Request rejected'));
                    }}
                  >
                    Decline
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ borderRadius: 2.5 }}
                    onClick={() => {
                      if (!userData) return;
                      dispatch(
                        accept({
                          userId: userData.id,
                          followerId: user.id,
                        })
                      ).then(() => handleOpenSnackBar('Friend request accepted!'));
                    }}
                  >
                    Accept
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Requests;
