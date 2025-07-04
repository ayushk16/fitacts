import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../functions/config";

const initialState = {
    loading: false,
    data: [],
    error: null
}

export const fetchEvents = createAsyncThunk('events/fetchEvents', ({ userid }) => {
    return axios
        .get(config.API_BASE_URL + '/events', { params: { id: userid } })
        .then(res => { return (res.data) })
})

export const addEvent = createAsyncThunk('events/addEvent', ({ name, userid, activityid, distance, duration }) => {
    return axios
        .post(config.API_BASE_URL + "/events", {
            name, userid, activityid, distance, duration
        }).then(res => { return (res.data) })
})

export const updateEvent = createAsyncThunk('events/updateEvent', ({ eventid, showintimeline, userid }) => {
    return axios
        .put(config.API_BASE_URL + "/events", { userid, eventid, showintimeline })
        .then(res => { return (res.data) })
})

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearEvents: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
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
        builder.addCase(updateEvent.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            state.loading = false;
            state.data = state.data.map(event => {
                if (event.eventid === action.payload.data.eventid) {
                    return action.payload.data;
                }
                return event;
            })
            state.error = null;
        })
        builder.addCase(updateEvent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })


    }
})


export const { clearEvents } = eventsSlice.actions;

export default eventsSlice.reducer;