import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    data: {},
}


const followedUserSlice = createSlice({
    name: 'followedUser',
    initialState,
    reducers: {
        setFollowedUser: (state, action) => {
            state.data = action.payload.data;

        },
        clearFollowedUser: (state, action) => {
            state.data = {};
        }
    },
})

export const { clearFollowedUser, setFollowedUser } = followedUserSlice.actions;


export default followedUserSlice.reducer;