import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Stack,
  Chip,
  TextField,
  Button,
  Collapse,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaRegComment,
  FaRunning,
  FaBiking,
  FaSwimmer,
  FaWalking,
  FaTrashAlt,
  FaEllipsisV,
  FaUserPlus,
  FaUserCheck,
  FaMusic,
  FaSmoking,
} from 'react-icons/fa';
import { MdRowing } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import config from '../../functions/config';
import { getUser } from '../../functions/tokenSet';
import { useThemeMode } from '../../theme/ThemeContext';
import ActivityImageBox from '../Common/ActivityImageBox';
import LikesModal from './LikesModal';

const getActivityIcon = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('swim')) return <FaSwimmer />;
  if (lower.includes('row')) return <MdRowing />;
  if (lower.includes('smok')) return <FaSmoking />;
  if (lower.includes('bike') || lower.includes('cycl')) return <FaBiking />;
  if (lower.includes('walk')) return <FaWalking />;
  return <FaRunning />;
};

const formatDuration = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}h ` : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
};

const WorkoutCard = ({
  event,
  onDelete,
  onLikeToggle,
  showDeleteOption = false,
  isOwnDashboard = false,
}) => {
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();
  const { mode } = useThemeMode();

  const [isLiked, setIsLiked] = useState(Boolean(event.isLiked));
  const [likesCount, setLikesCount] = useState(event.likesCount || 0);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState(event.recentComments || []);
  const [commentsCount, setCommentsCount] = useState(event.commentsCount || 0);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(
    event.isFriend ? 'friend' : 'none'
  );

  const authorUsername = event.authorUsername || currentUser?.username || 'athlete';
  const authorFullName =
    event.authorFirstname && event.authorLastname
      ? `${event.authorFirstname} ${event.authorLastname}`
      : authorUsername;
  const isOwnPost = currentUser?.id === event.userid;

  const handleLikeClick = async () => {
    if (!currentUser) return;
    const previousState = isLiked;
    const previousCount = likesCount;

    // Optimistic UI update
    setIsLiked(!previousState);
    setLikesCount(previousState ? Math.max(0, previousCount - 1) : previousCount + 1);

    try {
      const res = await axios.post(`${config.API_BASE_URL}/events/${event.id || event.eventid}/like`, {
        userid: currentUser.id,
      });
      if (res.data?.data) {
        setIsLiked(res.data.data.isLiked);
        setLikesCount(res.data.data.likesCount);
      }
      if (onLikeToggle) {
        onLikeToggle(event.id || event.eventid, !previousState);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert on error
      setIsLiked(previousState);
      setLikesCount(previousCount);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setSubmittingComment(true);
    try {
      const res = await axios.post(
        `${config.API_BASE_URL}/events/${event.id || event.eventid}/comments`,
        {
          userid: currentUser.id,
          content: newComment.trim(),
        }
      );

      if (res.data?.data) {
        setCommentsList((prev) => [res.data.data, ...prev]);
        setCommentsCount((prev) => prev + 1);
        setNewComment('');
        setShowComments(true);
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!currentUser) return;
    try {
      await axios.post(`${config.API_BASE_URL}/user/addPending`, {
        followerid: currentUser.id,
        followedid: event.userid,
      });
      setFriendshipStatus('pending');
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };

  const goToUserProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <>
      <Card
        sx={{
          width: '100%',
          maxWidth: 580,
          mx: 'auto',
          mb: 3.5,
          bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'all 0.25s ease-in-out',
          '&:hover': {
            boxShadow:
              mode === 'dark'
                ? '0 12px 30px -5px rgba(0, 0, 0, 0.7)'
                : '0 12px 30px -5px rgba(0, 0, 0, 0.08)',
          },
        }}
      >
        {/* Post Header */}
        <CardHeader
          avatar={
            <Avatar
              sx={{
                bgcolor: mode === 'dark' ? '#6366f1' : '#4f46e5',
                cursor: 'pointer',
                fontWeight: 700,
                width: 44,
                height: 44,
              }}
              onClick={() => goToUserProfile(authorUsername)}
            >
              {authorFullName.charAt(0).toUpperCase()}
            </Avatar>
          }
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* If not own post and not friends yet, show follow/add button */}
              {!isOwnPost && (
                <>
                  {friendshipStatus === 'friend' ? (
                    <Chip
                      icon={<FaUserCheck fontSize={12} />}
                      label="Friend"
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  ) : friendshipStatus === 'pending' ? (
                    <Chip label="Requested" size="small" variant="outlined" />
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<FaUserPlus fontSize={12} />}
                      onClick={handleSendFriendRequest}
                      sx={{ py: 0.4, px: 1.5, fontSize: '0.78rem' }}
                    >
                      Connect
                    </Button>
                  )}
                </>
              )}

              {(isOwnPost || showDeleteOption) && (
                <>
                  <IconButton
                    size="small"
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                  >
                    <FaEllipsisV fontSize={14} />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                  >
                    <MenuItem
                      onClick={() => {
                        setMenuAnchor(null);
                        if (onDelete) onDelete(event.id || event.eventid);
                      }}
                      sx={{ color: 'error.main', display: 'flex', gap: 1.5 }}
                    >
                      <FaTrashAlt fontSize={14} />
                      Delete Workout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          }
          title={
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' },
              }}
              onClick={() => goToUserProfile(authorUsername)}
            >
              {authorFullName}
            </Typography>
          }
          secondary={
            <Typography variant="caption" color="text.secondary">
              @{authorUsername} •{' '}
              {new Date(event.created_at || event.timestamp || Date.now()).toLocaleDateString(
                undefined,
                { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
              )}
            </Typography>
          }
          sx={{ pb: 1.5 }}
        />

        {/* Workout Activity Highlights */}
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            {event.name || event.eventname}
          </Typography>

          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
            <Chip
              icon={getActivityIcon(event.activityname || event.name)}
              label={event.activityname || 'Workout'}
              color="primary"
              variant="filled"
              sx={{ fontWeight: 600, px: 0.5 }}
            />
            <Chip
              label={`${event.distance || 0} ${event.distanceunit || 'km'}`}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              label={formatDuration(event.duration)}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        {/* Photo Box (Image or S3 Fallback Identifier Box) */}
        <Box sx={{ px: 2.5, pb: 1.5 }}>
          <ActivityImageBox
            imageUrl={event.image_url}
            activityName={event.activityname || event.name}
            caption={event.caption}
          />
        </Box>

        {/* Action Row: Heart, Comment, Likes Count */}
        <CardActions
          disableSpacing
          sx={{
            px: 2.5,
            pt: 0.5,
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
            <IconButton
              onClick={handleLikeClick}
              sx={{
                color: isLiked ? '#f43f5e' : 'inherit',
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'scale(1.15)' },
              }}
            >
              {isLiked ? <FaHeart fontSize={22} /> : <FaRegHeart fontSize={22} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Comments">
            <IconButton
              onClick={() => setShowComments(!showComments)}
              sx={{ color: showComments ? 'primary.main' : 'inherit' }}
            >
              {showComments ? <FaComment fontSize={20} /> : <FaRegComment fontSize={20} />}
            </IconButton>
          </Tooltip>

          {/* Likes counter: clicking opens who liked the post */}
          <Typography
            variant="body2"
            fontWeight={700}
            sx={{
              cursor: 'pointer',
              ml: 0.5,
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => setShowLikesModal(true)}
          >
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowComments(!showComments)}
          >
            {commentsCount} comments
          </Typography>
        </CardActions>

        {/* Caption */}
        {event.caption && (
          <Box sx={{ px: 2.5, pb: 1.5 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              <Box
                component="span"
                fontWeight={700}
                sx={{ mr: 1, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                onClick={() => goToUserProfile(authorUsername)}
              >
                @{authorUsername}
              </Box>
              {event.caption}
            </Typography>
          </Box>
        )}

        {/* Expandable Comments Section */}
        <Collapse in={showComments} timeout="auto" unmountOnExit>
          <Box
            sx={{
              px: 2.5,
              pt: 1.5,
              pb: 2,
              borderTop:
                mode === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.06)'
                  : '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Comment List */}
            <Stack spacing={1.5} sx={{ mb: 2, maxHeight: 220, overflowY: 'auto' }}>
              {commentsList.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  No comments yet. Be the first to cheer on this workout!
                </Typography>
              ) : (
                commentsList.map((comm, idx) => (
                  <Box key={comm.id || idx} sx={{ display: 'flex', gap: 1 }}>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { color: 'primary.main' },
                      }}
                      onClick={() => goToUserProfile(comm.username || authorUsername)}
                    >
                      @{comm.username || 'user'}:
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {comm.content}
                    </Typography>
                  </Box>
                ))
              )}
            </Stack>

            {/* Comment Input */}
            <Box
              component="form"
              onSubmit={handleAddComment}
              sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
            >
              <TextField
                size="small"
                fullWidth
                placeholder="Cheer or comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submittingComment || !newComment.trim()}
                sx={{ borderRadius: 3, px: 2.5 }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Card>

      {/* Likes Modal */}
      <LikesModal
        open={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        eventId={event.id || event.eventid}
        onFriendRequestSent={() => {}}
      />
    </>
  );
};

export default WorkoutCard;
