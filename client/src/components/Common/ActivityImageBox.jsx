import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { FaCloudUploadAlt, FaImage } from 'react-icons/fa';
import { useThemeMode } from '../../theme/ThemeContext';

const ActivityImageBox = ({ imageUrl, activityName = 'Activity', caption, height = 220 }) => {
  const [loadError, setLoadError] = useState(false);
  const { mode } = useThemeMode();

  const isHttpUrl = Boolean(
    imageUrl &&
    (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:image/'))
  );

  const shouldRenderImage = isHttpUrl && !loadError;

  if (shouldRenderImage) {
    return (
      <Box
        sx={{
          width: '100%',
          height,
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: mode === 'dark' ? '#1f2937' : '#f1f5f9',
        }}
      >
        <img
          src={imageUrl}
          alt={caption || activityName}
          onError={() => setLoadError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </Box>
    );
  }

  // Display empty image box with the text stored in the url's place in between
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: height,
        borderRadius: 3,
        border: mode === 'dark' ? '2px dashed rgba(99, 102, 241, 0.35)' : '2px dashed rgba(79, 70, 229, 0.3)',
        bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.6)' : 'rgba(241, 245, 249, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2.5,
        textAlign: 'center',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: mode === 'dark' ? 'rgba(99, 102, 241, 0.6)' : 'rgba(79, 70, 229, 0.5)',
          bgcolor: mode === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(241, 245, 249, 0.9)',
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: mode === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: mode === 'dark' ? '#818cf8' : '#4f46e5',
          marginBottom: 1.5,
        }}
      >
        <FaImage fontSize={22} />
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: mode === 'dark' ? '#94a3b8' : '#64748b',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 0.5,
        }}
      >
        Cloud Storage Identifier
      </Typography>

      {/* The exact text stored in the url's place in DB */}
      <Typography
        variant="body2"
        sx={{
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: mode === 'dark' ? '#f8fafc' : '#0f172a',
          wordBreak: 'break-all',
          bgcolor: mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
          padding: '6px 12px',
          borderRadius: 1.5,
          border: mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          maxWidth: '90%',
        }}
      >
        {imageUrl || `${activityName.toLowerCase()}_placeholder`}
      </Typography>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          marginTop: 1,
          color: mode === 'dark' ? '#64748b' : '#94a3b8',
        }}
      >
        <FaCloudUploadAlt fontSize={14} />
        <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
          AWS S3 destination ready
        </Typography>
      </Box>
    </Box>
  );
};

export default ActivityImageBox;
