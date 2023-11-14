import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { getToken } from "../../../functions/tokenSet";

const initialState = {
    loading: false,
    data: [],
    error: null,
}


export const fetchActivities = createAsyncThunk("activities/fetchActivities", async () => {
    console.log("fetchActivitiescalled")
    const token = getToken();
    return axios
        .get('http://localhost:3000/activities/all/')
        .then(res => { return res.data })
});


const activitiesSlice = createSlice({
    name: "activities",
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchActivities.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchActivities.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchActivities.rejected, (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = action.payload.message;
        })
    }
});

export default activitiesSlice.reducer;