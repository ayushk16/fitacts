import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../functions/config";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    return axios
        .get(config.API_BASE_URL + '/signup/')
        .then((res) => res.data);
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        clearUsers: (state, action) => {
            state.loading = false;
            state.data = [];
            state.error = null;
        }
    },
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

export const { clearUsers } = usersSlice.actions;

export default usersSlice.reducer;