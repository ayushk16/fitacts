import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUserToken } from "../../functions/tokenSet";
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
            const token = action.payload.data.token.accessToken;
            const user = action.payload.data.user;
            setUserToken({ token: token, user: user })
        },
        errorlogin: (state, action) => {
            state.data = {}
            state.error = action.payload.message;
        }
    },
})

export const { login, logout, errorlogin } = userSlice.actions;
export default userSlice.reducer;