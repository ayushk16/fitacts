import React, { useEffect } from 'react';
import { getToken, getUser, removeUserToken } from '../functions/tokenSet';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/user/userSlice.js';
const Test = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    if (!token && !user) {
      removeUserToken();
      navigate('/login');
    } else {
      dispatch(login({ data: { token: { accessToken: token }, user: user } }));
    }
  }, []);

  return (
    <>
      <h1
        onClick={() => {
          removeUserToken();
        }}
      >
        Test
      </h1>
    </>
  );
};

export default Test;
