import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
    error: null,
    data: {}
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.error = null
            state.data = {}
        },
        login: (state, action) => {
            state.error = null
            state.data = action.payload
        },
        error: (state, action) => {
            state.data = {}
            state.error = action.payload
        }
    },
})

export const { login, logout, error } = userSlice.actions;
export default userSlice.reducer;