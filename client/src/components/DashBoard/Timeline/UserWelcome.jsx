import React from 'react';
import { Box, Container, Typography, Stack, Card, Grid, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import { FaFire, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { getUser } from '../../../functions/tokenSet';
import { useThemeMode } from '../../../theme/ThemeContext';

const UserWelcome = () => {
  const { mode } = useThemeMode();
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const eventsData = useSelector((state) => state.events?.data || []);
  const currentUser = reduxUser || getUser();

  const totalDistance = eventsData.reduce((acc, curr) => acc + (parseFloat(curr.distance) || 0), 0);
  const totalDurationSeconds = eventsData.reduce((acc, curr) => acc + (parseInt(curr.duration, 10) || 0), 0);
  const totalHours = (totalDurationSeconds / 3600).toFixed(1);

  if (!currentUser) return null;

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 2 }}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background:
            mode === 'dark'
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.04) 100%)',
          border:
            mode === 'dark'
              ? '1px solid rgba(99, 102, 241, 0.25)'
              : '1px solid rgba(99, 102, 241, 0.15)',
          mb: 3,
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
              <Typography variant="h4" fontWeight={800}>
                Welcome back, {currentUser.firstname}!
              </Typography>
              {currentUser.aadharpresent && (
                <Chip
                  icon={<FaCheckCircle fontSize={12} />}
                  label="Aadhaar Verified"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Stack>
            <Typography variant="body1" color="text.secondary">
              @{currentUser.username || 'athlete'} • Track, share, and stay fit together.
            </Typography>
          </Box>
        </Stack>

        {/* Quick Stats Grid */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <Typography variant="h5" fontWeight={800} color="primary.main">
                {eventsData.length}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Workouts
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <Typography variant="h5" fontWeight={800} color="secondary.main">
                {totalDistance.toFixed(1)}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Total Distance (km/m)
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <Typography variant="h5" fontWeight={800} sx={{ color: '#f59e0b' }}>
                {totalHours}h
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Active Time
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Card
              sx={{
                p: 2,
                textAlign: 'center',
                bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              }}
            >
              <Typography variant="h5" fontWeight={800} sx={{ color: currentUser.aadharpresent ? '#10b981' : '#94a3b8' }}>
                {currentUser.aadharpresent ? 'Active' : 'Pending'}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Aadhaar Verification
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default UserWelcome;
