import { clearTopEvents } from "../features/dashboard/activities/topEvents/topEvents";
import { clearActivities } from "../features/dashboard/activities/activitiesSlice";
import { clearEvents } from "../features/dashboard/eventSlice";
import { clearFollowedUser } from "../features/user/followedUserSlice";
import { clearFollowing } from "../features/user/followingSlice";
import { cleanUp } from "../features/user/userSignupSlice";
import { logout } from "../features/user/userSlice";
import { clearUsers } from "../features/user/usersSlice";
import { clearPending } from "../features/user/pendingSlice";
import { clearRequest } from "../features/user/requestSlice";
import store from "../app/store.js";

export const clearAll = async (customDispatch) => {
    const dispatch = customDispatch || store.dispatch;
    dispatch(clearTopEvents());
    dispatch(clearActivities());
    dispatch(clearEvents());
    dispatch(clearFollowedUser());
    dispatch(clearFollowing());
    dispatch(clearPending());
    dispatch(clearUsers());
    dispatch(clearRequest());
    dispatch(cleanUp());
    dispatch(logout());
    localStorage.removeItem('feedallignment');
};