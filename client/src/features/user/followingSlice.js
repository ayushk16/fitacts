import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import config from "../../functions/config";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchFollowing = createAsyncThunk('following/fetchFollowing', ({ userId }) => {
    return axios
        .get(config.API_BASE_URL + `/user/following`, { params: { userid: userId } })
        .then((res) => res.data);
})



export const unfollow = createAsyncThunk('following/unfollow', ({ userId, followingId }) => {
    return axios
        .delete(config.API_BASE_URL + `/user/unfollow`, { params: { followerid: userId, followedid: followingId } })
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