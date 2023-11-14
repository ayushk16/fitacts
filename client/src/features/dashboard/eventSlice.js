import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null
}

export const fetchEvents = createAsyncThunk('events/fetchEvents', ({ userid }) => {
    return axios
        .get('http://localhost:3000/events', { params: { id: userid } })
        .then(res => { return (res.data) })
})

export const addEvent = createAsyncThunk('events/addEvent', ({ name, userid, activityid, distance, duration }) => {
    return axios
        .post("http://localhost:3000/events", {
            name, userid, activityid, distance, duration
        }).then(res => { return (res.data) })
})

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchEvents.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
        builder.addCase(addEvent.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(addEvent.fulfilled, (state, action) => {
            state.loading = false;
            state.data = [...state.data, action.payload.data];
            state.error = null;
        })
        builder.addCase(addEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })

    }
})

export default eventsSlice.reducer;