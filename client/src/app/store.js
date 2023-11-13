import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice.js';
import userSignupreducer from "../features/user/userSignupSlice.js";
import eventSlicereducer from "../features/dashboard/eventSlice.js";
import activitiesSlicereducer from "../features/dashboard/activities/activitiesSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        userSignup: userSignupreducer,
        events: eventSlicereducer,
        activities: activitiesSlicereducer,
    }
})

export default store;