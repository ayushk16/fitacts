import React, { useState } from 'react';
import {
  Grid,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { updateFavorite } from '../../../features/user/userSlice';
import { getToken, getUser } from '../../../functions/tokenSet';
const Activity = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);
  const [checked, setChecked] = useState(
    userData.data.data &&
      userData.data.data.user.favorites &&
      userData.data.data.user.favorites.includes(item.id)
  );

  const handleChange = (event) => {
    setChecked(event.target.checked);
    let user = { ...userData.data.data.user };
    let itemId = item.id;
    const userId = user.id;
    const value = event.target.checked ? 'true' : 'false';
    if (event.target.checked == false) {
      if (user.favorites.includes(itemId)) {
        let temparray = [...user.favorites];
        temparray = temparray.filter((item) => item !== itemId);
        user.favorites = [...temparray];
      }
    }
    if (event.target.checked == true) {
      if (!user.favorites.includes(itemId)) {
        user.favorites = [...user.favorites, itemId];
      }
    }
    axios
      .put('http://localhost:3000/activities/favorite', {
        userId: userId,
        activityId: itemId,
        value: value,
      })
      .then((res) => {
        dispatch(
          updateFavorite({
            data: { user: res.data.data, token: { accessToken: getToken() } },
          })
        );
      });
  };

  return (
    <>
      <Grid item xs={12} sm={6} md={4} lg={3} height={100} margin={2}>
        <Card
          sx={{
            height: '100%',
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              textAlign="center"
              onClick={(e) => {
                navigate(`/dashboard/activities/${item.id}`);
              }}
            >
              {item.name}
            </Typography>
          </Box>
          <Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleChange(e);
                    }}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Favorite"
              />
            </FormGroup>
          </Box>
        </Card>
      </Grid>
    </>
  );
};

export default Activity;
