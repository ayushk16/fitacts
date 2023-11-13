import { Container, Stack, Button, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const DummyClock = () => {
  return (
    <>
      <Container>
        <Stack
          sx={{
            minHeight: '300px',
            minWidth: '500px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            direction: 'column',
          }}
        >
          <Stack direction="column" justifyContent="center">
            <Typography disabled variant="h1" color={'lightgrey'}>
              00:00:00
            </Typography>

            <Stack direction="row" justifyContent="center">
              <Button variant="contained" disabled>
                Start
              </Button>
              <Button variant="contained" disabled>
                Reset
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default DummyClock;
