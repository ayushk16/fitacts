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
  Input,
} from '@mui/material';
import { SnackBarContext } from '../../../App.jsx';
import { Upload } from '@mui/icons-material';
import { updateAadhar } from '../../../features/user/userSlice';
import { getToken } from '../../../functions/tokenSet';
import config from '../../../functions/config.js';

const AadharUpload = ({ userid }) => {
  const dispatch = useDispatch();
  const { handleOpenSnackBar } = useContext(SnackBarContext);
  const [aadhar, setAadhar] = useState(null);

  const handleAadhar = (e) => {
    setAadhar(e.target.files[0].name);
  };
  const uploadAadhar = () => {
    axios
      .put(config.API_BASE_URL + '/user', { userid: userid, aadhardata: aadhar })
      .then((res) => {
        dispatch(
          updateAadhar({
            data: { user: res.data.data, token: { accessToken: getToken() } },
          })
        ).then(handleOpenSnackBar('Aadhar uploaded successfully'));
      });
  };

  return (
    <>
      <DashboardHeader />
      <Container>
        <Stack
          spacing={2}
          display={'flex'}
          alignItems={'center'}
          marginTop={'200px'}
          justifyContent={'center'}
        >
          <Card sx={{ height: '200px', padding: '30px' }}>
            <Stack
              spacing={2}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-evenly'}
              sx={{ height: '100%' }}
            >
              <Typography variant={'h6'}> Upload Aadhar Card</Typography>
              <Input
                type={'file'}
                onChange={(e) => {
                  handleAadhar(e);
                }}
              />
              <Button
                variant={'contained'}
                disabled={!aadhar}
                style={
                  aadhar
                    ? { backgroundColor: '#A7727D', color: '#FAFDD6' }
                    : {
                        backgroundColor: '#A7727D',
                        color: '#FAFDD6',
                        opacity: '0.5',
                      }
                }
                onClick={() => {
                  uploadAadhar();
                }}
              >
                <Upload />
                Upload
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

export default AadharUpload;
