import { getUsers, creatUserController } from "./signUpController.js";
import { loginController } from "./loginController.js";
import { getActivity, getAllActivities, updateFavorite, getUserFavorites } from "./activitiesController.js";
import { getAllEvents, createEvent, updateEvent, getTopEvents } from "./eventsController.js";
import { getUser, updateUser } from "./userController.js";

export default { getUsers, creatUserController, loginController, getAllEvents, getAllActivities, getActivity, updateFavorite, updateEvent, getUserFavorites, getTopEvents, getUser, updateUser, createEvent };