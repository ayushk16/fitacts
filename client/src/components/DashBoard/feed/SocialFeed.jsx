import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography, Skeleton, Button, Stack, Alert } from '@mui/material';
import { FaUsers, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../../functions/config';
import { getUser } from '../../../functions/tokenSet';
import WorkoutCard from '../../Social/WorkoutCard';
import { useThemeMode } from '../../../theme/ThemeContext';

const SocialFeed = ({ onSwitchToAllUsers }) => {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();
  const { mode } = useThemeMode();

  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    const effectiveUser = currentUser || getUser();
    if (!effectiveUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${config.API_BASE_URL}/events/feed`, {
        params: { userId: effectiveUser.id },
      });
      setFeedPosts(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching social feed:', err);
      setError(err.response?.data?.message || 'Unable to load feed at this time.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 3 }}>
        {[1, 2].map((n) => (
          <Box key={n} sx={{ mb: 3 }}>
            <Skeleton variant="rounded" height={60} sx={{ mb: 1, borderRadius: 3 }} />
            <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
          </Box>
        ))}
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert
          severity="error"
          sx={{ borderRadius: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchFeed}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 3, pb: 8 }}>
      {feedPosts.length === 0 ? (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: 'center',
            borderRadius: 4,
            border:
              mode === 'dark'
                ? '1px dashed rgba(255, 255, 255, 0.12)'
                : '1px dashed rgba(0, 0, 0, 0.12)',
            bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <FaUsers fontSize={28} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Your Feed is Quiet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 380, mx: 'auto' }}>
            When you connect with friends, all their latest swimming, rowing, and running
            activities will show up right here in your feed!
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={onSwitchToAllUsers}
              sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
            >
              Discover Athletes
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaPlus />}
              onClick={() => navigate('/dashboard/fitscale')}
              sx={{ borderRadius: 3, px: 2.5 }}
            >
              Post Workout
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={1}>
          {feedPosts.map((post) => (
            <WorkoutCard
              key={post.id || post.eventid}
              event={post}
              showDeleteOption={currentUser?.id === post.userid}
              onDelete={async (deletedId) => {
                try {
                  await axios.delete(`${config.API_BASE_URL}/events/${deletedId}`, {
                    params: { userid: currentUser.id },
                  });
                  setFeedPosts((prev) => prev.filter((p) => (p.id || p.eventid) !== deletedId));
                } catch (err) {
                  console.error('Error deleting post:', err);
                }
              }}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default SocialFeed;
