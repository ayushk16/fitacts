import React, { useState } from 'react';
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
import { Upload } from '@mui/icons-material';
import { updateAadhar } from '../../../features/user/userSlice';
import { getToken } from '../../../functions/tokenSet';

const AadharUpload = ({ userid }) => {
  const dispatch = useDispatch();
  const [aadhar, setAadhar] = useState(null);

  const handleAadhar = (e) => {
    setAadhar(e.target.files[0].name);
  };
  const uploadAadhar = () => {
    axios
      .put('http://localhost:3000/user', { userid: userid, aadhardata: aadhar })
      .then((res) => {
        dispatch(
          updateAadhar({
            data: { user: res.data.data, token: { accessToken: getToken() } },
          })
        );
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
