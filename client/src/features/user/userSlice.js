import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setUserToken } from "../../functions/tokenSet";
import axios from 'axios'

const initialState = {
    loading: false,
    error: null,
    data: {}
}




const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.loading = false
            state.error = null
            state.data = {}
        },
        login: (state, action) => {
            state.loading = false
            state.error = null
            state.data = action.payload
            const token = action.payload.data.token.accessToken;
            const user = action.payload.data.user;
            setUserToken({ token: token, user: user })
        },
        errorlogin: (state, action) => {
            state.loading = false
            state.data = {}
            state.error = action.payload.message;
        },
        updateFavorite: (state, action) => {
            state.data = action.payload;
            const token = action.payload.data.token.accessToken;
            const user = action.payload.data.user;
            setUserToken({ token: token, user: user })

        },
        updateAadhar: (state, action) => {
            state.data = action.payload;
            const token = action.payload.data.token.accessToken;
            const user = action.payload.data.user;
            setUserToken({ token: token, user: user })
        }

    },
    // extraReducers: builder => {
    //     builder.addCase(updateUser.pending, (state, action) => {
    //         state.loading = true
    //         state.error = null
    //         state.data = {}
    //     })
    //     builder.addCase(updateUser.fulfilled, (state, action) => {
    //         state.loading = false
    //         state.error = null
    //         state.data = action.payload
    //         const token = action.payload.data.token.accessToken;
    //         const user = action.payload.data.user;
    //         setUserToken({ token: token, user: user })
    //     })
    //     builder.addCase(updateUser.rejected, (state, action) => {
    //         state.loading = false
    //         state.error = action.payload.message
    //         state.data = {}
    //     })
    // }
})

export const { login, logout, errorlogin, updateFavorite, updateAadhar } = userSlice.actions;
export default userSlice.reducer;