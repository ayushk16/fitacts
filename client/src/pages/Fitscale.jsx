import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  Grid,
  Stack,
  TextField,
  Button,
  InputAdornment,
  Chip,
  Skeleton,
  Paper,
  Divider,
} from '@mui/material';
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaCheckCircle,
  FaRunning,
  FaBiking,
  FaSwimmer,
  FaWalking,
  FaMusic,
  FaSave,
  FaStar,
} from 'react-icons/fa';
import { MdRowing } from 'react-icons/md';

import { fetchActivities } from '../features/dashboard/activities/activitiesSlice';
import { fetchEvents } from '../features/dashboard/eventSlice';
import DashboardHeader from '../components/DashboardHeader';
import EventsTable from '../components/DashBoard/Fitscale/EventsTable';
import SaveEvent from '../components/DashBoard/Fitscale/SaveEvent';
import { getUser, getToken } from '../functions/tokenSet';
import { useThemeMode } from '../theme/ThemeContext';

const getActivityIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('swim')) return <FaSwimmer fontSize={22} />;
  if (lower.includes('row')) return <MdRowing fontSize={22} />;
  if (lower.includes('danc')) return <FaMusic fontSize={22} />;
  if (lower.includes('bike') || lower.includes('cycl')) return <FaBiking fontSize={22} />;
  if (lower.includes('walk')) return <FaWalking fontSize={22} />;
  return <FaRunning fontSize={22} />;
};

const Fitscale = () => {
  const dispatch = useDispatch();
  const { mode } = useThemeMode();

  const reduxUser = useSelector((state) => state.user?.data?.data?.user);
  const currentUser = reduxUser || getUser();

  const activitiesState = useSelector((state) => state.activities);
  const eventsState = useSelector((state) => state.events);

  // Selected Activity state (defaults to first activity or first favorite)
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Distance input state
  const [distance, setDistance] = useState('');

  // Timer / Stopwatch state
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modal state
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // 1. Fetch activities and user's events on mount to prevent blank events on refresh!
  useEffect(() => {
    dispatch(fetchActivities());
    const userId = currentUser?.id || getUser()?.id;
    if (userId) {
      dispatch(fetchEvents({ userid: userId }));
    }
  }, [dispatch, currentUser?.id]);

  // Set default selected activity once activities load
  useEffect(() => {
    if (!selectedActivity && activitiesState.data && activitiesState.data.length > 0) {
      const userFavs = currentUser?.favorites || [];
      const defaultFav = activitiesState.data.find((a) => userFavs.includes(String(a.id)));
      setSelectedActivity(defaultFav || activitiesState.data[0]);
    }
  }, [activitiesState.data, selectedActivity]);

  // Stopwatch Interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 59) {
            setMinutes((prevMin) => {
              if (prevMin === 59) {
                setHours((prevHr) => prevHr + 1);
                return 0;
              }
              return prevMin + 1;
            });
            return 0;
          }
          return prevSec + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const resetTimer = () => {
    setIsTimerRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const addQuickTime = (minsToAdd) => {
    setMinutes((prevMin) => {
      const newTotal = prevMin + minsToAdd;
      if (newTotal >= 60) {
        setHours((prevHr) => prevHr + Math.floor(newTotal / 60));
        return newTotal % 60;
      }
      return newTotal;
    });
  };

  const clearForm = () => {
    setDistance('');
    resetTimer();
  };

  const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
  const isFormSavable = Boolean(
    selectedActivity && (parseFloat(distance) > 0 || totalTimeInSeconds > 0)
  );

  return (
    <>
      <DashboardHeader />
      <Box
        sx={{
          bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc',
          minHeight: 'calc(100vh - 70px)',
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header Banner */}
          <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Fitscale Workout Tracker
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Select your activity, then run the timer or enter distance in any order to record your workout.
            </Typography>
          </Box>

          {/* STEP 1: SELECT ACTIVITY FIRST */}
          <Card
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: mode === 'dark' ? '#f8fafc' : '#0f172a',
              }}
            >
              <Chip label="1" size="small" color="primary" sx={{ fontWeight: 800 }} />
              Select Activity
            </Typography>

            {activitiesState.loading ? (
              <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', py: 1 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Skeleton key={n} variant="rounded" width={140} height={70} sx={{ borderRadius: 3 }} />
                ))}
              </Stack>
            ) : (
              <Grid container spacing={2}>
                {(activitiesState.data || []).map((activity) => {
                  const isSelected = selectedActivity?.id === activity.id;
                  const isFavorite = (currentUser?.favorites || []).includes(String(activity.id));

                  return (
                    <Grid item xs={6} sm={4} md={2} key={activity.id}>
                      <Card
                        onClick={() => setSelectedActivity(activity)}
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          cursor: 'pointer',
                          borderRadius: 3,
                          transition: 'all 0.2s ease-in-out',
                          position: 'relative',
                          border: isSelected
                            ? '2px solid #6366f1'
                            : mode === 'dark'
                            ? '1px solid rgba(255, 255, 255, 0.08)'
                            : '1px solid rgba(0, 0, 0, 0.08)',
                          bgcolor: isSelected
                            ? mode === 'dark'
                              ? 'rgba(99, 102, 241, 0.15)'
                              : 'rgba(79, 70, 229, 0.08)'
                            : mode === 'dark'
                            ? '#1e293b'
                            : '#ffffff',
                          transform: isSelected ? 'scale(1.03)' : 'none',
                          boxShadow: isSelected
                            ? '0 6px 20px rgba(99, 102, 241, 0.3)'
                            : 'none',
                          '&:hover': {
                            borderColor: '#6366f1',
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {isFavorite && (
                          <Box sx={{ position: 'absolute', top: 6, right: 6, color: '#f59e0b' }}>
                            <FaStar fontSize={11} />
                          </Box>
                        )}
                        <Box
                          sx={{
                            color: isSelected ? 'primary.main' : 'text.secondary',
                            mb: 1,
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
                          {getActivityIcon(activity.name)}
                        </Box>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {activity.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.distanceunit}
                        </Typography>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Card>

          {/* STEP 2: TIMER & DISTANCE SIDE-BY-SIDE (DO WHICHEVER FIRST) */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Panel A: Duration / Stopwatch */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Chip label="2" size="small" color="primary" sx={{ fontWeight: 800 }} />
                    Track Duration (Timer)
                  </Typography>

                  {/* Digital Clock Display */}
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3.5,
                      textAlign: 'center',
                      bgcolor: mode === 'dark' ? '#090d16' : '#f1f5f9',
                      border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
                      mb: 2.5,
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        letterSpacing: '0.05em',
                        color: isTimerRunning ? '#10b981' : mode === 'dark' ? '#f8fafc' : '#0f172a',
                      }}
                    >
                      {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isTimerRunning ? 'Stopwatch active • Recording time' : 'Timer ready'}
                    </Typography>
                  </Box>

                  {/* Stopwatch Controls */}
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                    <Button
                      variant="contained"
                      color={isTimerRunning ? 'warning' : 'success'}
                      startIcon={isTimerRunning ? <FaPause /> : <FaPlay />}
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      sx={{ px: 3, py: 1.2, borderRadius: 3, fontWeight: 700 }}
                    >
                      {isTimerRunning ? 'Pause' : 'Start Timer'}
                    </Button>

                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<FaRedo />}
                      onClick={resetTimer}
                      sx={{ px: 2.5, borderRadius: 3 }}
                    >
                      Reset
                    </Button>
                  </Stack>
                </Box>

                {/* Quick Add Presets */}
                <Box sx={{ pt: 1.5, borderTop: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Quick Add Minutes:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {[5, 10, 15, 30].map((mins) => (
                      <Chip
                        key={mins}
                        label={`+${mins}m`}
                        onClick={() => addQuickTime(mins)}
                        clickable
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Card>
            </Grid>

            {/* Panel B: Distance & Unit */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 4,
                  bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Chip label="3" size="small" color="primary" sx={{ fontWeight: 800 }} />
                    Enter Distance
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Workout Distance"
                      type="number"
                      fullWidth
                      placeholder="e.g. 5.0"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Chip
                              label={selectedActivity?.distanceunit || 'km'}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      helperText={`Activity measured in ${selectedActivity?.distanceunit || 'units'}`}
                    />
                  </Box>

                  {/* Quick Distance Presets */}
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Quick Distance Presets:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                    {(selectedActivity?.distanceunit === 'meters'
                      ? [250, 500, 1000, 1500, 2000]
                      : selectedActivity?.distanceunit === 'steps'
                      ? [1000, 3000, 5000, 10000]
                      : [1, 3, 5, 10, 21.1]
                    ).map((val) => (
                      <Chip
                        key={val}
                        label={`${val} ${selectedActivity?.distanceunit || 'km'}`}
                        onClick={() => setDistance(String(val))}
                        clickable
                        size="small"
                        variant={parseFloat(distance) === val ? 'filled' : 'outlined'}
                        color={parseFloat(distance) === val ? 'primary' : 'default'}
                        sx={{ borderRadius: 2 }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Save / Log Workout Action Button */}
                <Box sx={{ pt: 2, borderTop: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0,0,0,0.06)' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={!isFormSavable}
                    startIcon={<FaSave />}
                    onClick={() => setSaveModalOpen(true)}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 800,
                      background: isFormSavable
                        ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                        : undefined,
                      boxShadow: isFormSavable ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                    }}
                  >
                    Save & Share Workout
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* WORKOUT RECORDS TABLE (PREVENTS BLANK ON REFRESH) */}
          <Box sx={{ mt: 5, mb: 8 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
              Your Previous Records
            </Typography>
            <EventsTable />
          </Box>
        </Container>
      </Box>

      {/* Save Workout Dialog with photo upload & caption */}
      {selectedActivity && (
        <SaveEvent
          distance={{ distance: parseFloat(distance) || 0 }}
          activity={selectedActivity}
          time={{ hours, minutes, seconds }}
          open={saveModalOpen}
          handleClose={() => setSaveModalOpen(false)}
          clearActivityAndDistance={clearForm}
          resetTimer={resetTimer}
        />
      )}
    </>
  );
};

export default Fitscale;
