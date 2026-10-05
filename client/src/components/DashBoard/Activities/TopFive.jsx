import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
  Box,
  Button,
  Chip,
} from '@mui/material';
import { FaArrowLeft, FaTrophy, FaMedal } from 'react-icons/fa';
import DashboardHeader from '../../DashboardHeader';
import { fetchTopEvents } from '../../../features/dashboard/activities/topEvents/topEvents';
import { fetchActivities } from '../../../features/dashboard/activities/activitiesSlice';
import { useThemeMode } from '../../../theme/ThemeContext';

const getRankColor = (rank) => {
  if (rank === 1) return '#f59e0b'; // Gold
  if (rank === 2) return '#94a3b8'; // Silver
  if (rank === 3) return '#b45309'; // Bronze
  return '#6366f1';
};

const TopFive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useThemeMode();

  useEffect(() => {
    dispatch(fetchTopEvents({ id }));
    dispatch(fetchActivities());
  }, [dispatch, id]);

  const activitiesData = useSelector((state) => state.activities);
  const topEventsData = useSelector((state) => state.topEvents);

  const currentActivity = (activitiesData.data || []).find(
    (a) => String(a.id) === String(id)
  );
  const activityName = currentActivity ? currentActivity.name : 'Activity';

  if (topEventsData.loading) {
    return (
      <Box sx={{ bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: '100vh' }}>
        <DashboardHeader />
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Skeleton variant="rounded" height={60} sx={{ mb: 3, borderRadius: 3 }} />
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} variant="rounded" height={90} sx={{ mb: 2, borderRadius: 3 }} />
          ))}
        </Container>
      </Box>
    );
  }

  const events = topEventsData.data || [];

  return (
    <Box sx={{ bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: '100vh', pb: 8 }}>
      <DashboardHeader />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Navigation & Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Button
            startIcon={<FaArrowLeft />}
            onClick={() => navigate('/dashboard/activities')}
            sx={{
              borderRadius: 3,
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            All Activities
          </Button>
        </Stack>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <FaTrophy fontSize={26} color="#f59e0b" />
            <Typography variant="h4" fontWeight={800}>
              Top 5 Workouts: {activityName}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Longest and highest performance records logged for {activityName}
          </Typography>
        </Box>

        {events.length === 0 ? (
          <Card
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              No Records Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Be the first to record a workout for {activityName}!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard/fitscale')}
              sx={{ borderRadius: 3, fontWeight: 700 }}
            >
              Record Workout
            </Button>
          </Card>
        ) : (
          <Stack spacing={2}>
            {events.map((event, index) => {
              const rank = index + 1;
              const durationSec = event.duration || 0;
              const h = Math.floor(durationSec / 3600);
              const m = Math.floor((durationSec % 3600) / 60);
              const s = durationSec % 60;
              const formattedDuration = `${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;

              return (
                <Card
                  key={event.eventid || event.id || index}
                  sx={{
                    p: 2.5,
                    borderRadius: 4,
                    bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                    border:
                      rank === 1
                        ? '1px solid rgba(245, 158, 11, 0.4)'
                        : mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.08)'
                        : '1px solid rgba(0, 0, 0, 0.06)',
                    boxShadow:
                      rank === 1
                        ? '0 8px 24px -4px rgba(245, 158, 11, 0.15)'
                        : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2.5}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        bgcolor: `${getRankColor(rank)}20`,
                        color: getRankColor(rank),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                      }}
                    >
                      {rank <= 3 ? <FaMedal /> : `#${rank}`}
                    </Box>

                    <Box>
                      <Typography variant="h6" fontWeight={700}>
                        {event.eventname || event.name || 'Workout'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Logged on{' '}
                        {new Date(event.created_at || event.timestamp || Date.now()).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        {event.distance} {event.distanceunit || 'km'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Duration: {formattedDuration}
                      </Typography>
                    </Box>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default TopFive;
