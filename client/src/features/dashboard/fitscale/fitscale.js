import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null
}

export const fetchUserFavorites = createAsyncThunk('events/fetchEvents', ({ userid }) => {
    return axios
        .get('http://localhost:3000/activities', { params: { id: userid } })
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
            state.error = action.error.message;
        })
    }
})

export const { clearEvents } = eventsSlice.actions;

export default eventsSlice.reducer;