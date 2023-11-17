import { Router } from "express";
import { getAllActivities, getActivity, getUserFavorites, updateFavorite } from "../controllers/activitiesController.js";

export const router = Router();

router.get("/all/", getAllActivities)
router.get("/one/", getActivity);
router.put("/favorite/", updateFavorite);
router.get("/favorite/:id", getUserFavorites);