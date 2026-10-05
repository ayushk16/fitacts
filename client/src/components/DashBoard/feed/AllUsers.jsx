import React, { useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Skeleton,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { FaUserPlus, FaUserCheck, FaUserClock, FaEye, FaCheck } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../../features/user/usersSlice';
import { addPending } from '../../../features/user/pendingSlice';
import { unfollow, fetchFollowing } from '../../../features/user/followingSlice';
import { accept, fetchRequest } from '../../../features/user/requestSlice';
import { SnackBarContext } from '../../../App.jsx';
import { useThemeMode } from '../../../theme/ThemeContext';
import { getUser } from '../../../functions/tokenSet';

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();

  const usersState = useSelector((state) => state.users);
  const followingState = useSelector((state) => state.following);
  const pendingState = useSelector((state) => state.pending);
  const activitiesState = useSelector((state) => state.activities);

  useEffect(() => {
    const effectiveUser = currentUser || getUser();
    if (effectiveUser?.id) {
      dispatch(fetchUsers({ currentUserId: effectiveUser.id }));
      dispatch(fetchFollowing({ userId: effectiveUser.id }));
      dispatch(fetchRequest({ userId: effectiveUser.id }));
    }
  }, [dispatch, currentUser?.id]);

  const handleSendRequest = (targetUserId) => {
    const effectiveUser = currentUser || getUser();
    if (!effectiveUser?.id) return;
    dispatch(
      addPending({
        followerid: effectiveUser.id,
        followedid: targetUserId,
      })
    ).then(() => {
      handleOpenSnackBar('Friend request sent!');
      dispatch(fetchUsers({ currentUserId: effectiveUser.id }));
    });
  };

  const handleAcceptRequest = (targetUserId) => {
    const effectiveUser = currentUser || getUser();
    if (!effectiveUser?.id) return;
    dispatch(
      accept({
        userId: effectiveUser.id,
        followerId: targetUserId,
      })
    ).then(() => {
      handleOpenSnackBar('Friend request accepted!');
      dispatch(fetchUsers({ currentUserId: effectiveUser.id }));
      dispatch(fetchFollowing({ userId: effectiveUser.id }));
    });
  };

  const handleUnfollow = (targetUserId) => {
    const effectiveUser = currentUser || getUser();
    if (!effectiveUser?.id) return;
    dispatch(
      unfollow({
        userId: effectiveUser.id,
        followingId: targetUserId,
      })
    ).then(() => {
      handleOpenSnackBar('Unfollowed user');
      dispatch(fetchUsers({ currentUserId: effectiveUser.id }));
      dispatch(fetchFollowing({ userId: effectiveUser.id }));
    });
  };

  if (usersState.loading && (!usersState.data || usersState.data.length === 0)) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} variant="rounded" height={80} sx={{ mb: 2, borderRadius: 3 }} />
        ))}
      </Container>
    );
  }

  const otherUsers = (usersState.data || []).filter((u) => u.id !== currentUser?.id);

  return (
    <Container maxWidth="md" sx={{ mt: 3, pb: 8 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2.5 }}>
        Athletes in the Community
      </Typography>

      {otherUsers.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <Typography color="text.secondary">No other athletes found.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {otherUsers.map((user) => {
            const isFriend =
              user.relationship === 'friend' ||
              (followingState.data || []).some(
                (f) => (f.id === user.id || f.followeduserid === user.id) && f.state === 'followed'
              );

            const isPendingSent =
              user.relationship === 'pending_sent' ||
              (pendingState.data || []).some(
                (p) => (p.id === user.id || p.followeduserid === user.id) && p.state === 'pending'
              );

            const isPendingReceived = user.relationship === 'pending_received';

            return (
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
                    border:
                      isFriend
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {/* Left: Avatar + Info */}
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
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="subtitle1" fontWeight={700}>
                          {user.firstname} {user.lastname}
                        </Typography>
                        {isFriend && (
                          <Chip
                            icon={<FaUserCheck fontSize={11} />}
                            label="Friend"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                          />
                        )}
                        {isPendingSent && (
                          <Chip
                            label="Request Sent"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                          />
                        )}
                        {isPendingReceived && (
                          <Chip
                            label="Pending your approval"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                          />
                        )}
                      </Stack>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        @{user.username || user.firstname.toLowerCase()}
                      </Typography>

                      {/* Favorite Activities */}
                      {user.favorites && user.favorites.length > 0 && (
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.8 }} flexWrap="wrap">
                          {user.favorites.map((favId) => {
                            const act = (activitiesState.data || []).find(
                              (a) => String(a.id) === String(favId)
                            );
                            return act ? (
                              <Chip
                                key={favId}
                                label={act.name}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20, mr: 0.5, mb: 0.5 }}
                              />
                            ) : null;
                          })}
                        </Stack>
                      )}
                    </Box>
                  </Box>

                  {/* Right: Actions */}
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FaEye />}
                      onClick={() => navigate(`/profile/${user.username || user.firstname}`)}
                      sx={{ borderRadius: 2.5 }}
                    >
                      Profile
                    </Button>

                    {isFriend ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleUnfollow(user.id)}
                        sx={{ borderRadius: 2.5 }}
                      >
                        Unfriend
                      </Button>
                    ) : isPendingReceived ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<FaCheck />}
                        onClick={() => handleAcceptRequest(user.id)}
                        sx={{ borderRadius: 2.5 }}
                      >
                        Accept
                      </Button>
                    ) : isPendingSent ? (
                      <Chip
                        icon={<FaUserClock fontSize={12} />}
                        label="Requested"
                        variant="outlined"
                        size="small"
                        color="warning"
                      />
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<FaUserPlus />}
                        onClick={() => handleSendRequest(user.id)}
                        sx={{ borderRadius: 2.5 }}
                      >
                        Connect
                      </Button>
                    )}
                  </Stack>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default AllUsers;
