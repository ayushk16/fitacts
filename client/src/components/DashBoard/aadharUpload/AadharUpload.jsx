import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import DashboardHeader from '../../DashboardHeader';
import {
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { SnackBarContext } from '../../../App.jsx';
import { FaShieldAlt, FaFileUpload } from 'react-icons/fa';
import { updateAadhar } from '../../../features/user/userSlice';
import { getToken } from '../../../functions/tokenSet';
import config from '../../../functions/config.js';
import { useThemeMode } from '../../../theme/ThemeContext';

const AadharUpload = ({ userid }) => {
  const dispatch = useDispatch();
  const { mode } = useThemeMode();
  const { handleOpenSnackBar } = useContext(SnackBarContext);
  const [aadharFileName, setAadharFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAadhar = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAadharFileName(e.target.files[0].name);
    }
  };

  const uploadAadhar = async () => {
    if (!aadharFileName || !userid) return;
    setUploading(true);
    try {
      const res = await axios.put(`${config.API_BASE_URL}/user`, {
        userid,
        aadhardata: aadharFileName,
      });

      if (res.data?.data) {
        dispatch(
          updateAadhar({
            data: { user: res.data.data, token: { accessToken: getToken() } },
          })
        );
        handleOpenSnackBar('Aadhaar uploaded and verified successfully!');
      }
    } catch (err) {
      console.error('Error uploading aadhaar:', err);
      handleOpenSnackBar('Failed to upload Aadhaar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <DashboardHeader />
      <Box sx={{ bgcolor: mode === 'dark' ? '#0b0f19' : '#f8fafc', minHeight: 'calc(100vh - 70px)', py: 8 }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
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
                mb: 2.5,
              }}
            >
              <FaShieldAlt fontSize={30} />
            </Box>

            <Typography variant="h5" fontWeight={800} gutterBottom>
              Aadhaar Verification Required
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please upload your Aadhaar document to verify your athlete profile and unlock full activity tracking.
            </Typography>

            <Box
              component="label"
              sx={{
                display: 'block',
                p: 3,
                border: mode === 'dark' ? '2px dashed rgba(255,255,255,0.15)' : '2px dashed rgba(0,0,0,0.15)',
                borderRadius: 3,
                cursor: 'pointer',
                mb: 3,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: mode === 'dark' ? 'rgba(99,102,241,0.05)' : 'rgba(79,70,229,0.03)',
                },
              }}
            >
              <input type="file" accept="image/*,application/pdf" hidden onChange={handleAadhar} />
              <FaFileUpload fontSize={24} style={{ color: '#6366f1', marginBottom: 8 }} />
              <Typography variant="body2" fontWeight={600}>
                {aadharFileName ? `Selected: ${aadharFileName}` : 'Choose Aadhaar image or document'}
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!aadharFileName || uploading}
              onClick={uploadAadhar}
              sx={{
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              }}
            >
              {uploading ? <CircularProgress size={24} color="inherit" /> : 'Submit & Verify Aadhaar'}
            </Button>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default AadharUpload;
