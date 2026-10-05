import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  Avatar,
  Stack,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  FaArrowLeft,
  FaUserPlus,
  FaUserCheck,
  FaUserClock,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
  FaFileUpload,
} from 'react-icons/fa';
import axios from 'axios';
import DashboardHeader from '../components/DashboardHeader';
import WorkoutCard from '../components/Social/WorkoutCard';
import { useSelector } from 'react-redux';
import config from '../functions/config';
import { getUser, removeUserToken } from '../functions/tokenSet';
import { SnackBarContext } from '../App';
import { useThemeMode } from '../theme/ThemeContext';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);

  const reduxUser = useSelector((state) => state.user?.data?.data?.user || state.user?.data?.user);
  const currentUser = reduxUser || getUser();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Aadhaar upload modal state
  const [aadharOpen, setAadharOpen] = useState(false);
  const [aadharFile, setAadharFile] = useState('');
  const [uploadingAadhar, setUploadingAadhar] = useState(false);

  const isSelf =
    !username ||
    username === currentUser?.username ||
    username === currentUser?.firstname;

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const identifier = isSelf ? currentUser?.id : username;
      const res = await axios.get(`${config.API_BASE_URL}/user/profile/${identifier}`, {
        params: { currentUserId: currentUser?.id },
      });

      if (res.data?.data) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('User profile not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      removeUserToken();
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [username, currentUser?.id]);

  const handleSendFriendRequest = async () => {
    if (!currentUser || !profileData?.user?.id) return;
    setActionLoading(true);
    try {
      await axios.post(`${config.API_BASE_URL}/user/addPending`, {
        followerid: currentUser.id,
        followedid: profileData.user.id,
      });
      handleOpenSnackBar('Friend request sent!');
      setProfileData((prev) => ({
        ...prev,
        relationship: 'pending_sent',
      }));
    } catch (err) {
      console.error('Error sending friend request:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (!currentUser || !profileData?.user?.id) return;
    setActionLoading(true);
    try {
      await axios.put(`${config.API_BASE_URL}/user/follow`, {
        followerid: profileData.user.id,
        followedid: currentUser.id,
      });
      handleOpenSnackBar('Friend request accepted!');
      setProfileData((prev) => ({
        ...prev,
        relationship: 'friend',
        isFriend: true,
      }));
      fetchProfile();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!currentUser || !profileData?.user?.id) return;
    setActionLoading(true);
    try {
      await axios.delete(`${config.API_BASE_URL}/user/unfollow`, {
        params: {
          followerid: currentUser.id,
          followedid: profileData.user.id,
        },
      });
      handleOpenSnackBar('Unfollowed user');
      setProfileData((prev) => ({
        ...prev,
        relationship: 'none',
        isFriend: false,
      }));
      fetchProfile();
    } catch (err) {
      console.error('Error unfollowing:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUploadAadhaar = async () => {
    if (!aadharFile.trim()) return;
    setUploadingAadhar(true);
    try {
      await axios.put(`${config.API_BASE_URL}/user`, {
        userid: currentUser.id,
        aadhardata: aadharFile.trim(),
      });
      handleOpenSnackBar('Aadhaar submitted & verified successfully!');
      setAadharOpen(false);
      setAadharFile('');
      fetchProfile();
    } catch (err) {
      console.error('Error uploading aadhaar:', err);
      handleOpenSnackBar('Failed to update Aadhaar data');
    } finally {
      setUploadingAadhar(false);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader />
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={36} />
        </Container>
      </>
    );
  }

  if (error || !profileData) {
    return (
      <>
        <DashboardHeader />
        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'User not found'}
          </Alert>
          <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<FaArrowLeft />}>
            Go Back
          </Button>
        </Container>
      </>
    );
  }

  const { user, relationship, isFriend, posts = [], limitedView } = profileData;
  const isPendingSent = relationship === 'pending_sent';
  const isPendingReceived = relationship === 'pending_received';

  return (
    <>
      <DashboardHeader />
      <Box sx={{ bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: 'calc(100vh - 70px)', py: 4 }}>
        <Container maxWidth="sm">
          {/* Back button */}
          <Button
            onClick={() => navigate(-1)}
            startIcon={<FaArrowLeft />}
            sx={{ mb: 3, color: 'text.secondary', fontWeight: 600 }}
          >
            Back
          </Button>

          {/* Profile Header Card */}
          <Card
            sx={{
              p: 3.5,
              mb: 4,
              borderRadius: 4,
              bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
              boxShadow: mode === 'dark' ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.06)',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  width: 76,
                  height: 76,
                  bgcolor: mode === 'dark' ? '#6366f1' : '#4f46e5',
                  fontSize: '2rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                }}
              >
                {user.firstname?.charAt(0).toUpperCase()}
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" fontWeight={800}>
                  {user.firstname} {user.lastname}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  @{user.username || user.firstname.toLowerCase()}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {user.aadharpresent ? (
                    <Chip
                      icon={<FaCheckCircle fontSize={12} />}
                      label="Aadhaar Verified"
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  ) : (
                    <Chip
                      icon={<FaShieldAlt fontSize={12} />}
                      label="Aadhaar Pending"
                      color="warning"
                      size="small"
                      variant="outlined"
                    />
                  )}

                  <Chip label={`${posts.length} Workouts`} size="small" variant="outlined" />
                </Stack>
              </Box>
            </Stack>

            {/* Profile Action Buttons */}
            <Box sx={{ mt: 3, pt: 2.5, borderTop: mode === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)' }}>
              {isSelf ? (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<FaFileUpload />}
                    onClick={() => setAadharOpen(true)}
                    sx={{ borderRadius: 3 }}
                  >
                    {user.aadharpresent ? 'Update Aadhaar' : 'Upload Aadhaar Image'}
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={2} alignItems="center">
                  {isFriend ? (
                    <>
                      <Chip
                        icon={<FaUserCheck fontSize={14} />}
                        label="Friends"
                        color="success"
                        variant="filled"
                        sx={{ px: 1, fontWeight: 700 }}
                      />
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        disabled={actionLoading}
                        onClick={handleUnfollow}
                        sx={{ borderRadius: 3 }}
                      >
                        Unfollow
                      </Button>
                    </>
                  ) : isPendingSent ? (
                    <Chip
                      icon={<FaUserClock fontSize={14} />}
                      label="Friend Request Pending"
                      variant="outlined"
                    />
                  ) : isPendingReceived ? (
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={actionLoading}
                      onClick={handleAcceptRequest}
                      sx={{ borderRadius: 3 }}
                    >
                      Accept Friend Request
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FaUserPlus />}
                      disabled={actionLoading}
                      onClick={handleSendFriendRequest}
                      sx={{ borderRadius: 3, px: 3, fontWeight: 700 }}
                    >
                      Add Friend
                    </Button>
                  )}
                </Stack>
              )}
            </Box>
          </Card>

          {/* Non-friend limited view banner */}
          {limitedView && !isSelf && (
            <Alert
              severity="info"
              icon={<FaLock />}
              sx={{
                mb: 3,
                borderRadius: 3,
                bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.12)' : 'rgba(79, 70, 229, 0.08)',
                border: mode === 'dark' ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid rgba(79, 70, 229, 0.15)',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Viewing 5 latest posts • Connect with @{user.username} to become friends and see their full workout history!
              </Typography>
            </Alert>
          )}

          {/* Workouts Feed */}
          <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
            {isSelf ? 'Your Workout Posts' : `${user.firstname}'s Workouts`}
          </Typography>

          {posts.length === 0 ? (
            <Box
              sx={{
                py: 6,
                textAlign: 'center',
                borderRadius: 4,
                bgcolor: mode === 'dark' ? '#111827' : '#ffffff',
                border: mode === 'dark' ? '1px dashed rgba(255,255,255,0.1)' : '1px dashed rgba(0,0,0,0.1)',
              }}
            >
              <Typography color="text.secondary">No workouts posted yet.</Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {posts.map((post) => (
                <WorkoutCard
                  key={post.id || post.eventid}
                  event={{
                    ...post,
                    authorUsername: user.username,
                    authorFirstname: user.firstname,
                    authorLastname: user.lastname,
                    isFriend,
                  }}
                  showDeleteOption={isSelf}
                  onDelete={isSelf ? fetchProfile : undefined}
                />
              ))}
            </Stack>
          )}
        </Container>
      </Box>

      {/* Aadhaar Upload Dialog */}
      <Dialog
        open={aadharOpen}
        onClose={() => setAadharOpen(false)}
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
        <DialogTitle sx={{ fontWeight: 800 }}>Validate Aadhaar</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            Upload Aadhaar document image / key identifier to complete your athlete verification.
          </Typography>
          <TextField
            label="Aadhaar Image URL or Storage Key"
            fullWidth
            placeholder="e.g. s3://aadhaar/user_aadhaar_card.jpg"
            value={aadharFile}
            onChange={(e) => setAadharFile(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAadharOpen(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!aadharFile.trim() || uploadingAadhar}
            onClick={handleUploadAadhaar}
            sx={{ borderRadius: 2 }}
          >
            {uploadingAadhar ? 'Saving...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
