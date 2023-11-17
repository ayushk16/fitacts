import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice.js';
import userSignupreducer from "../features/user/userSignupSlice.js";
import eventSlicereducer from "../features/dashboard/eventSlice.js";
import activitiesSlicereducer from "../features/dashboard/activities/activitiesSlice.js";
import topEventsSlicereducer from "../features/dashboard/activities/topEvents/topEvents.js";
import userSlicereducer from "../features/user/usersSlice.js";
import followingSlicereducer from "../features/user/followingSlice.js";
import followedUserEventsreducer from "../features/user/followedUserEvents.js";
import followedUserreducer from "../features/user/followedUserSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        userSignup: userSignupreducer,
        events: eventSlicereducer,
        activities: activitiesSlicereducer,
        users: userSlicereducer,
        topEvents: topEventsSlicereducer,
        following: followingSlicereducer,
        followedUserEvents: followedUserEventsreducer,
        followedUser: followedUserreducer,
    }
})

export default store;