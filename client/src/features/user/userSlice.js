import { createSlice } from '@reduxjs/toolkit';
import { setUserToken, getUser, getToken, getRefreshToken, removeUserToken } from '../../functions/tokenSet';

const savedUser = getUser();
const savedToken = getToken();

const initialState = {
  loading: false,
  error: null,
  data: savedUser?.id
    ? {
        data: {
          user: savedUser,
          token: { accessToken: savedToken },
        },
      }
    : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.error = null;
      state.data = null;
      removeUserToken();
    },
    login: (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
      const token =
        action.payload?.data?.token?.accessToken ||
        (typeof action.payload?.data?.token === 'string' ? action.payload?.data?.token : null) ||
        getToken();
      const refreshToken =
        action.payload?.data?.token?.refreshToken ||
        action.payload?.data?.refreshToken ||
        getRefreshToken();
      const user = action.payload?.data?.user || action.payload?.user;
      if (user && user.id) {
        setUserToken({ token, refreshToken, user });
      }
    },
    errorlogin: (state, action) => {
      state.loading = false;
      state.data = null;
      state.error = action.payload?.message || 'Login failed';
    },
    updateFavorite: (state, action) => {
      const updatedUser = action.payload?.data?.user || action.payload?.data || action.payload?.user;
      const token = action.payload?.data?.token?.accessToken || getToken();
      if (updatedUser && updatedUser.id) {
        state.data = {
          data: {
            user: updatedUser,
            token: { accessToken: token },
          },
        };
        setUserToken({ token, user: updatedUser });
      }
    },
    updateAadhar: (state, action) => {
      const updatedUser = action.payload?.data?.user || action.payload?.data || action.payload?.user;
      const token = action.payload?.data?.token?.accessToken || getToken();
      if (updatedUser && updatedUser.id) {
        state.data = {
          data: {
            user: updatedUser,
            token: { accessToken: token },
          },
        };
        setUserToken({ token, user: updatedUser });
      }
    },
  },
});

export const { login, logout, errorlogin, updateFavorite, updateAadhar } = userSlice.actions;
export default userSlice.reducer;