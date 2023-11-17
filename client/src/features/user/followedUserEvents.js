import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    length: 0,
    error: null,
}

export const fetchFollowedUserEvents = createAsyncThunk('followedUserEvents/fetchFollowedUserEvents', ({ userId }) => {
    return axios
        .get('http://localhost:3000/events/breakdown', { params: { id: userId, limit: 5, offset: 0 } })
        .then(res => { return (res.data) })
})

export const fetchAgain = createAsyncThunk('followedUserEvents/fetchAgain', ({ userId, offset }) => {
    return axios
        .get('http://localhost:3000/events/breakdown', { params: { id: userId, limit: 2, offset: offset } })
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
            if (action.payload.data) {
                state.data = action.payload.data.events;
                state.length = action.payload.data.length;
            }
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
            if (action.payload.data) {
                if (action.payload.data.events[0].id === state.data[state.data.length - 1].id) {

                }
                else {
                    state.data = [...state.data, ...action.payload.data.events];
                    state.length = action.payload.length;
                }
            }
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