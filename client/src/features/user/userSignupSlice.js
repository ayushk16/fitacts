import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    error: null,
    data: {}
}


const createUserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signup: (state, action) => {
            state.error = null;
            state.data = action.payload;
        },
        errorsignup: (state, action) => {
            state.data = {};
            state.error = action.payload.message;
        },
        cleanUp: (state) => {
            state.data = {}
            state.error = null
        }
    }

})

export const { signup, errorsignup, cleanUp } = createUserSlice.actions;

export default createUserSlice.reducer;

