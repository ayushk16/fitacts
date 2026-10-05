import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import { FaCloudUploadAlt, FaTimes, FaCamera } from 'react-icons/fa';
import { SnackBarContext } from '../../../App.jsx';
import { addEvent, fetchEvents } from '../../../features/dashboard/eventSlice';
import { getUser } from '../../../functions/tokenSet';
import { useThemeMode } from '../../../theme/ThemeContext';

const SaveEvent = ({
  distance,
  activity,
  time,
  open,
  clearActivityAndDistance,
  resetTimer,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const [eventName, setEventName] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const userData = reduxUser || getUser();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setImagePreview(null);
  };

  const save = async () => {
    const effectiveUser = userData || getUser();
    if (!eventName.trim() || !activity || !effectiveUser) return;

    setSubmitting(true);
    const durationSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;

    try {
      await dispatch(
        addEvent({
          name: eventName.trim(),
          userid: effectiveUser.id,
          activityid: activity.id,
          distance: distance.distance,
          duration: durationSeconds,
          caption: caption.trim() || null,
          image_url: imagePreview || null, // Will use preview or trigger server S3 fallback string
          showintimeline: true,
        })
      ).unwrap();

      handleOpenSnackBar('Workout recorded and posted to feed!');
      dispatch(fetchEvents({ userid: effectiveUser.id }));
      setEventName('');
      setCaption('');
      setImagePreview(null);
      clearActivityAndDistance();
      resetTimer();
      handleClose();
    } catch (err) {
      console.error('Failed to save event:', err);
      handleOpenSnackBar('Failed to save workout');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
          backgroundImage: 'none',
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.4rem' }}>
        Record & Share Workout
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
        <Stack spacing={2.5}>
          {/* Workout Stats Summary */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(79, 70, 229, 0.06)',
              border: mode === 'dark' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(79, 70, 229, 0.15)',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  ACTIVITY
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {activity?.name || 'Workout'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  DISTANCE
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {distance?.distance} {activity?.distanceunit || 'km'}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  DURATION
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  {time.hours < 10 ? `0${time.hours}` : time.hours}:
                  {time.minutes < 10 ? `0${time.minutes}` : time.minutes}:
                  {time.seconds < 10 ? `0${time.seconds}` : time.seconds}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Workout Title */}
          <TextField
            label="Workout Title"
            fullWidth
            required
            placeholder="e.g., Morning 5K Pace Run, 1000m Freestyle"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />

          {/* Caption (Instagram-like feature) */}
          <TextField
            label="Caption (Instagram-style)"
            fullWidth
            multiline
            rows={2}
            placeholder="How did this workout feel? Any new personal bests?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          {/* Photo Upload with S3 Support & Fallback */}
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Workout Photo (AWS S3 Upload Support)
            </Typography>

            {imagePreview ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 180,
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={imagePreview}
                  alt="Selected workout"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  onClick={removeSelectedImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    color: '#ffffff',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                  }}
                  size="small"
                >
                  <FaTimes fontSize={14} />
                </IconButton>
              </Box>
            ) : (
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  borderRadius: 3,
                  border: mode === 'dark' ? '2px dashed rgba(255,255,255,0.15)' : '2px dashed rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(79, 70, 229, 0.03)',
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <FaCamera fontSize={24} style={{ marginBottom: 8, color: '#6366f1' }} />
                <Typography variant="body2" fontWeight={600}>
                  Click to upload workout photo
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  If no photo is selected, a unique S3 object key will be generated
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!eventName.trim() || submitting}
          onClick={save}
          sx={{
            borderRadius: 3,
            px: 3,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          }}
        >
          {submitting ? 'Saving...' : 'Post Workout'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveEvent;
