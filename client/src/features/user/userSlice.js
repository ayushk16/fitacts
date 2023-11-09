import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    data: {}
}


export const fetchUser = createAsyncThunk('user/login', ({ email, password }) => {
    return axios({
        method: 'GET',
        url: `http://localhost:3000/login`,
        data: {
            email,
            password
        }
    }).then(res => {
        return res.data;
    }).catch(err => {
        return err;
    })
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: builder => {
        builder.addCase(fetchUser.pending, (state, action) => {
            state.loading = true;
            state.data = {};
            state.error = null;
        })
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.data = {};
            state.error = action.payload.status;
        })
    }
})

export default userSlice.reducer;