import { getUsers, creatUserController } from "./signUpController.js";
import { loginController } from "./loginController.js";
import { getAllEvents, getActivity, getAllActivities, updateFavorite, getUserFavorites } from "./activitiesController.js";
import { getUser } from "./userController.js";

export default { getUsers, creatUserController, loginController, getAllEvents, getAllActivities, getActivity, updateFavorite, getUserFavorites, getUser };