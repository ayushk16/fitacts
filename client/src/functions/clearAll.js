import { clearTopEvents } from "../features/dashboard/activities/topEvents/topEvents";
import { clearActivities } from "../features/dashboard/activities/activitiesSlice";
import { clearEvents } from "../features/dashboard/eventSlice";
import { clearFollowedUser } from "../features/user/followedUserSlice";
import { clearFollowing } from "../features/user/followingSlice";
import { cleanUp } from "../features/user/userSignupSlice";
import { logout } from "../features/user/userSlice";
import { clearUsers } from "../features/user/usersSlice";

import { useDispatch } from "react-redux";

export const clearAll = async () => {
    const dispatch = useDispatch();
    dispatch(clearTopEvents())
        .then(dispatch(clearActivities()))
        .then(dispatch(clearEvents()))
        .then(dispatch(clearFollowedUser()))
        .then(dispatch(clearFollowing()))
        .then(dispatch(clearUsers()))
        .then(dispatch(cleanUp()))
        .then(dispatch(logout()))
    localStorage.removeItem('feedallignment');
}