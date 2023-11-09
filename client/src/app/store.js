import { configureStore } from "@reduxjs/toolkit";
import { useReducer } from "react";

import userReducer from '../features/user/userSlice.js';
import recentlyCreatedUserReducer from "../features/user/userSignupSlice.js";

const store = configureStore({
    reducer: {
        currentUser: userReducer,
        recentUserCreate: recentlyCreatedUserReducer,
    }
})

export default store;