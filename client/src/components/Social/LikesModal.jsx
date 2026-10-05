import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { FaUserPlus, FaUserCheck, FaUserClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../functions/config';
import { getUser } from '../../functions/tokenSet';
import { useThemeMode } from '../../theme/ThemeContext';

const LikesModal = ({ open, onClose, eventId, onFriendRequestSent }) => {
  const navigate = useNavigate();
  const currentUser = getUser();
  const { mode } = useThemeMode();
  const [likers, setLikers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (open && eventId) {
      setLoading(true);
      axios
        .get(`${config.API_BASE_URL}/events/${eventId}/likes`, {
          params: { currentUserId: currentUser?.id },
        })
        .then((res) => {
          setLikers(res.data?.data || []);
        })
        .catch((err) => {
          console.error('Error fetching event likes:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, eventId, currentUser?.id]);

  const handleSendFriendRequest = async (targetUserId) => {
    if (!currentUser) return;
    setActionLoading((prev) => ({ ...prev, [targetUserId]: true }));
    try {
      await axios.post(`${config.API_BASE_URL}/user/addPending`, {
        followerid: currentUser.id,
        followedid: targetUserId,
      });

      // Update state locally
      setLikers((prev) =>
        prev.map((liker) =>
          liker.id === targetUserId ? { ...liker, relationship: 'pending_sent' } : liker
        )
      );

      if (onFriendRequestSent) {
        onFriendRequestSent(targetUserId);
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleAcceptRequest = async (targetUserId) => {
    if (!currentUser) return;
    setActionLoading((prev) => ({ ...prev, [targetUserId]: true }));
    try {
      await axios.put(`${config.API_BASE_URL}/user/follow`, {
        followerid: targetUserId,
        followedid: currentUser.id,
      });

      setLikers((prev) =>
        prev.map((liker) =>
          liker.id === targetUserId ? { ...liker, relationship: 'friend' } : liker
        )
      );
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [targetUserId]: false }));
    }
  };

  const goToProfile = (username) => {
    onClose();
    navigate(`/profile/${username}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          py: 1.5,
          px: 2.5,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Likes
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
          <IoClose fontSize={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, maxHeight: 380 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : likers.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No likes yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {likers.map((liker) => {
              const isSelf = liker.id === currentUser?.id;
              const isFriend = liker.relationship === 'friend';
              const isPendingSent = liker.relationship === 'pending_sent';
              const isPendingReceived = liker.relationship === 'pending_received';
              const isActionLoading = actionLoading[liker.id];

              return (
                <ListItem
                  key={liker.id}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderBottom:
                      mode === 'dark' ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(0,0,0,0.04)',
                    '&:hover': {
                      bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  <ListItemAvatar
                    sx={{ cursor: 'pointer' }}
                    onClick={() => goToProfile(liker.username)}
                  >
                    <Avatar
                      sx={{
                        bgcolor: mode === 'dark' ? '#6366f1' : '#4f46e5',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {liker.firstname?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{ cursor: 'pointer' }}
                    onClick={() => goToProfile(liker.username)}
                    primary={
                      <Typography variant="body2" fontWeight={700}>
                        {liker.firstname} {liker.lastname}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        @{liker.username}
                      </Typography>
                    }
                  />

                  {/* Relationship / Friend Request Action */}
                  <Box sx={{ ml: 1 }}>
                    {isSelf ? (
                      <Chip label="You" size="small" variant="outlined" />
                    ) : isFriend ? (
                      <Chip
                        icon={<FaUserCheck fontSize={12} />}
                        label="Friends"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    ) : isPendingSent ? (
                      <Chip
                        icon={<FaUserClock fontSize={12} />}
                        label="Requested"
                        size="small"
                        variant="outlined"
                      />
                    ) : isPendingReceived ? (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        disabled={isActionLoading}
                        onClick={() => handleAcceptRequest(liker.id)}
                      >
                        Accept
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<FaUserPlus fontSize={12} />}
                        disabled={isActionLoading}
                        onClick={() => handleSendFriendRequest(liker.id)}
                      >
                        Add
                      </Button>
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LikesModal;
