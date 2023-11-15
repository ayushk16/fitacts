import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return axios
        .get('http://localhost:3000/signup/')
        .then((res) => res.data);
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchUsers.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        })
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        })
    }
})

export default usersSlice.reducer;