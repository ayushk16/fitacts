import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
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
        error: (state, action) => {
            state.data = {};
            state.error = action.payload;
        }
    }

})

export const { signup, error } = createUserSlice.actions;

export default createUserSlice.reducer;

