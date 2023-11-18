import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchFollowing = createAsyncThunk('following/fetchFollowing', ({ userId }) => {
    return axios
        .get(`http://localhost:3000/user/following`, { params: { userid: userId } })
        .then((res) => res.data);
})

export const addFollowing = createAsyncThunk('following/addFollowing', ({ userId, followingId }) => {
    return axios
        .post(`http://localhost:3000/user/follow`, { followerid: userId, followedid: followingId })
        .then((res) => res.data);
})

export const unfollow = createAsyncThunk('following/unfollow', ({ userId, followingId }) => {
    return axios
        .delete(`http://localhost:3000/user/unfollow`, { params: { followerid: userId, followedid: followingId } })
        .then((res) => {
            return res.data;
        });
})

const followingSlice = createSlice({
    name: 'following',
    initialState,
    reducers: {
        clearFollowing: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchFollowing.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchFollowing.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchFollowing.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        builder.addCase(addFollowing.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(addFollowing.fulfilled, (state, action) => {
            state.loading = false;
            state.data = [...state.data, action.payload.data];
            state.error = null;
        })
        builder.addCase(addFollowing.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        builder.addCase(unfollow.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(unfollow.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.filter((item) => item.followeruserid !== action.payload.data.followeruserid || item.followeduserid !== action.payload.data.followeduserid);
            state.error = null;
        })
        builder.addCase(unfollow.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export const { clearFollowing } = followingSlice.actions;

export default followingSlice.reducer;