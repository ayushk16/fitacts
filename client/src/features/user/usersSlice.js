import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../../functions/config";

import { getUser } from "../../functions/tokenSet";

const initialState = {
    loading: false,
    data: [],
    error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (params) => {
    const currentUserId = params?.currentUserId || getUser()?.id;
    return axios
        .get(config.API_BASE_URL + '/user/all', {
            params: { currentUserId },
        })
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
            state.error = action.payload?.message || action.error?.message || 'Failed to fetch users';
        })
    }
})

export const { clearUsers } = usersSlice.actions;

export default usersSlice.reducer;