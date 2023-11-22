import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchRequest = createAsyncThunk('request/fetchRequest', ({ userId }) => {
    return axios
        .get(`http://localhost:3000/user/requests`, { params: { userid: userId } })
        .then((res) => res.data);
})

export const accept = createAsyncThunk('request/accept', ({ userId, followerId }) => {
    return axios
        .put(`http://localhost:3000/user/follow`, { followerid: followerId, followedid: userId })
        .then((res) => res.data);
});

export const reject = createAsyncThunk('request/reject', ({ userId, followerId }) => {
    return axios
        .delete(`http://localhost:3000/user/unfollow`, { params: { followerid: followerId, followedid: userId } })
        .then((res) => res.data);
})

const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        clearRequest: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchRequest.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        });
        builder.addCase(fetchRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        });
        builder.addCase(accept.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(accept.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.filter((item) => item.id !== action.payload.data.id);
            state.error = null;
        })
        builder.addCase(accept.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        builder.addCase(reject.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(reject.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.filter((item) => item.id !== action.payload.data.followeruserid);
            state.error = null;
        })
        builder.addCase(reject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export const { clearRequest } = requestSlice.actions;

export default requestSlice.reducer;