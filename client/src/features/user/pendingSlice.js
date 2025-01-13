import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import config from "../../functions/config";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchPending = createAsyncThunk('pending/fetchPending', ({ userId }) => {
    return axios
        .get(config.API_BASE_URL + `/user/pending`, { params: { userid: userId } })
        .then((res) => res.data);
})

export const addPending = createAsyncThunk('pending/addPending', ({ userId, pendingId }) => {
    return axios
        .post(config.API_BASE_URL + `/user/addPending`, { followerid: userId, followedid: pendingId })
        .then((res) => res.data);
});

export const removePending = createAsyncThunk('pending/removePending', ({ userId, pendingId }) => {
    return axios
        .delete(config.API_BASE_URL + `/user/unfollow`, { params: { followerid: userId, followedid: pendingId } })
        .then((res) => {
            return res.data;
        });
})

const pendingSlice = createSlice({
    name: 'pending',
    initialState,
    reducers: {
        clearPending: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchPending.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchPending.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        });
        builder.addCase(fetchPending.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
        builder.addCase(addPending.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(addPending.fulfilled, (state, action) => {
            state.loading = false;
            state.data = [...state.data, action.payload.data];
            state.error = null;
        });
        builder.addCase(addPending.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
        builder.addCase(removePending.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(removePending.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.filter((item) => item.followeruserid !== action.payload.data.followeruserid || item.followeduserid !== action.payload.data.followeduserid);
            state.error = null;
        });
        builder.addCase(removePending.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
    }
})

export const { clearPending } = pendingSlice.actions;

export default pendingSlice.reducer;