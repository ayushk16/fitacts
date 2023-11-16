import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchFollowedUserEvents = createAsyncThunk('followedUserEvents/fetchFollowedUserEvents', ({ userId }) => {
    return axios
        .get('http://localhost:3000/events', { params: { id: userId } })
        .then(res => { return (res.data) })
})

export const fetchAgain = createAsyncThunk('followedUserEvents/fetchAgain', ({ userId }) => {
    return axios
        .get('http://localhost:3000/events', { params: { id: userId } })
        .then(res => { return (res.data) })
})

const followedUserEventsSlice = createSlice({
    name: 'followedUserEvents',
    initialState,
    reducers: {
        clearUserEvents: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchFollowedUserEvents.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchFollowedUserEvents.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchFollowedUserEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        builder.addCase(fetchAgain.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchAgain.fulfilled, (state, action) => {
            state.loading = false;
            state.data = [...state.data, ...action.payload.data];

            state.error = null;
        })
        builder.addCase(fetchAgain.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export const { clearUserEvents } = followedUserEventsSlice.actions;

export default followedUserEventsSlice.reducer;