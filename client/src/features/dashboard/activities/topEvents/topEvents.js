import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import { getUser } from "../../../../functions/tokenSet";
import config from "../../../../functions/config";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchTopEvents = createAsyncThunk("events/fetchTopEvents", async ({ id }) => {
    const user = getUser();
    return axios.get(config.API_BASE_URL + '/events/top/', { params: { userId: user.id, activityId: id } })
        .then(res => res.data);
});

const topEventsSlice = createSlice({
    name: "topEvents",
    initialState,
    reducers: {
        clearTopEvents: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTopEvents.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchTopEvents.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchTopEvents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export const { clearTopEvents } = topEventsSlice.actions;
export default topEventsSlice.reducer;