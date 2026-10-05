import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Skeleton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
} from '@mui/material';
import { FaPlus, FaRunning } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, deleteEvent } from '../../../features/dashboard/eventSlice.js';
import { getUser, getToken, removeUserToken } from '../../../functions/tokenSet.js';
import { SnackBarContext } from '../../../App.jsx';
import WorkoutCard from '../../Social/WorkoutCard.jsx';
import { useThemeMode } from '../../../theme/ThemeContext.jsx';

const ActivitiesShowCase = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  useEffect(() => {
    const effectiveUser = currentUser || getUser();
    const token = getToken();
    if (!effectiveUser && !token) {
      navigate('/login');
    } else if (effectiveUser?.id) {
      dispatch(fetchEvents({ userid: effectiveUser.id }));
    }
  }, [currentUser?.id, dispatch, navigate]);

  const eventsState = useSelector((state) => state.events);

  const confirmDelete = async () => {
    if (!deleteTargetId || !currentUser) return;
    try {
      await dispatch(deleteEvent({ eventid: deleteTargetId, userid: currentUser.id })).unwrap();
      handleOpenSnackBar('Workout record deleted successfully');
    } catch (err) {
      console.error('Error deleting record:', err);
      handleOpenSnackBar('Failed to delete workout record');
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (eventsState.loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {[1, 2].map((n) => (
          <Box key={n} sx={{ mb: 3 }}>
            <Skeleton variant="rounded" height={60} sx={{ mb: 1, borderRadius: 3 }} />
            <Skeleton variant="rounded" height={220} sx={{ borderRadius: 3 }} />
          </Box>
        ))}
      </Container>
    );
  }

  const timelineEvents = (eventsState.data || []).filter((e) => e.showintimeline !== false);

  return (
    <Container maxWidth="sm" sx={{ mt: 3, pb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          Your Fitness Timeline
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<FaPlus />}
          onClick={() => navigate('/dashboard/fitscale')}
          sx={{
            borderRadius: 3,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
          }}
        >
          Record Workout
        </Button>
      </Box>

      {timelineEvents.length === 0 ? (
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
            <FaRunning fontSize={28} />
          </Box>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            No Workouts Recorded Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, mx: 'auto' }}>
            Track swimming, rowing, running, or cycling with distance and duration to build your feed!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard/fitscale')}
            sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
          >
            Start Your First Workout
          </Button>
        </Box>
      ) : (
        <Stack spacing={1}>
          {timelineEvents.map((event) => (
            <WorkoutCard
              key={event.id || event.eventid}
              event={event}
              onDelete={(id) => setDeleteTargetId(id)}
              showDeleteOption={true}
              isOwnDashboard={true}
            />
          ))}
        </Stack>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Workout Record?</DialogTitle>
        <DialogContent>
          <DialogContentText color="text.secondary">
            Are you sure you want to permanently delete this workout? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTargetId(null)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ActivitiesShowCase;
