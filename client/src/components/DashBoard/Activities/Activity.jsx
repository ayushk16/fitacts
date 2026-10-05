import React, { useState } from 'react';
import {
  Grid,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import { FaHeart, FaRegHeart, FaSwimmer, FaRunning, FaBiking, FaWalking, FaSmoking } from 'react-icons/fa';
import { MdRowing } from 'react-icons/md';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { updateFavorite } from '../../../features/user/userSlice';
import { getToken, getUser } from '../../../functions/tokenSet';
import config from '../../../functions/config';
import { useThemeMode } from '../../../theme/ThemeContext';

const getActivityIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('swim')) return <FaSwimmer fontSize={28} />;
  if (lower.includes('row')) return <MdRowing fontSize={28} />;
  if (lower.includes('smok')) return <FaSmoking fontSize={28} />;
  if (lower.includes('bike') || lower.includes('cycl')) return <FaBiking fontSize={28} />;
  if (lower.includes('walk')) return <FaWalking fontSize={28} />;
  return <FaRunning fontSize={28} />;
};

const Activity = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useThemeMode();
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();

  const userFavorites = currentUser?.favorites || [];
  const isInitiallyFav = userFavorites.some((f) => String(f) === String(item.id));
  const [checked, setChecked] = useState(isInitiallyFav);

  React.useEffect(() => {
    setChecked(userFavorites.some((f) => String(f) === String(item.id)));
  }, [userFavorites, item.id]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    const nextState = !checked;
    setChecked(nextState);

    const userId = currentUser?.id;
    if (!userId) return;

    try {
      const res = await axios.put(`${config.API_BASE_URL}/activities/favorite`, {
        userId,
        activityId: item.id,
        value: nextState,
      });

      if (res.data?.data) {
        dispatch(
          updateFavorite({
            data: { user: res.data.data, token: { accessToken: getToken() } },
          })
        );
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setChecked(!nextState);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Card
        onClick={() => navigate(`/dashboard/activities/${item.id}`)}
        sx={{
          height: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: 4,
          position: 'relative',
          bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow:
              mode === 'dark'
                ? '0 12px 24px -5px rgba(0, 0, 0, 0.6)'
                : '0 12px 24px -5px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {/* Favorite Heart Button */}
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <IconButton
            size="small"
            onClick={handleToggleFavorite}
            sx={{
              color: checked ? '#f43f5e' : 'text.secondary',
              '&:hover': { transform: 'scale(1.15)' },
            }}
          >
            {checked ? <FaHeart fontSize={18} /> : <FaRegHeart fontSize={18} />}
          </IconButton>
        </Box>

        {/* Activity Icon */}
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {getActivityIcon(item.name)}
        </Box>

        <Typography variant="h6" fontWeight={700} gutterBottom>
          {item.name}
        </Typography>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Measured in {item.distanceunit || 'km'}
        </Typography>

        <Chip
          label="View Top Leaderboard"
          size="small"
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 2 }}
        />
      </Card>
    </Grid>
  );
};

export default Activity;
