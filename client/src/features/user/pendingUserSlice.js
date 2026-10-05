import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: {}
}


const pendingUserSlice = createSlice({
    name: "pendingUser",
    initialState,
    reducers: {
        setPendingUser: (state, action) => {
            state.data = action.payload.data;

        },
        clearPendingUser: (state, action) => {
            state.data = {};
        }
    },
})

export const { clearPendingUser, setPendingUser } = pendingUserSlice.actions;

export default pendingUserSlice.reducer;