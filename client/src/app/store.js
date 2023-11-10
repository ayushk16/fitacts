import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice.js';
import userSignupreducer from "../features/user/userSignupSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        userSignup: userSignupreducer,
    }
})

export default store;