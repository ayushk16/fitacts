import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null,
    data: {}
}


export const createUser = createAsyncThunk('user/signup', ({ firstname, lastname, email, phone, password }) => {
    return axios({
        method: "POST",
        url: `http://localhost:3000/signup`,
        data: {
            firstname, lastname, email, phone, password
        }
    }).then(res => {
        return res.data
    }).catch(err => {
        return err
    })
})

const createUserSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: builder => {
        builder.addCase(createUser.pending, (state, action) => {
            state.loading = true;
            state.data = {};
            state.error = null;
        })
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload.data;
            state.error = null;
        })
        builder.addCase(createUser.rejected, (state, action) => {
            state.loading = false;
            state.data = {};
            state.error = action.payload.status;
        })
    }
})

export default createUserSlice.reducer;

