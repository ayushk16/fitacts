import React, { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Box,
  Typography,
  Stack,
  Button,
  Skeleton,
  Avatar,
} from '@mui/material';
import { FaUserTimes, FaEye } from 'react-icons/fa';
import { SnackBarContext } from '../../../App.jsx';
import { unfollow, fetchFollowing } from '../../../features/user/followingSlice';
import { useThemeMode } from '../../../theme/ThemeContext';

import { getUser } from '../../../functions/tokenSet';

const FollowingUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const followingData = useSelector((state) => state.following);
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const userData = reduxUser || getUser();

  React.useEffect(() => {
    if (userData?.id) {
      dispatch(fetchFollowing({ userId: userData.id }));
    }
  }, [dispatch, userData?.id]);

  if (followingData.loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 3 }}>
        {[1, 2].map((n) => (
          <Skeleton key={n} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 3 }} />
        ))}
      </Container>
    );
  }

  const list = followingData.data || [];

  return (
    <Container maxWidth="md" sx={{ mt: 3, pb: 8 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2.5 }}>
        Friends & Following ({list.length})
      </Typography>

      {list.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">
            You are not following anyone yet. Visit "All Users" to discover athlete friends!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {list.map((user) => (
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
                    size="small"
                    startIcon={<FaEye />}
                    onClick={() => navigate(`/profile/${user.username || user.firstname}`)}
                    sx={{ borderRadius: 2.5 }}
                  >
                    Profile
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<FaUserTimes />}
                    sx={{ borderRadius: 2.5 }}
                    onClick={() => {
                      if (!userData) return;
                      dispatch(
                        unfollow({
                          userId: userData.id,
                          followingId: user.id || user.followeduserid,
                        })
                      ).then(() => handleOpenSnackBar('Unfollowed'));
                    }}
                  >
                    Unfollow
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

export default FollowingUsers;
