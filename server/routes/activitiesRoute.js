import { Router } from "express";
import { getAllActivities, updateFavorite } from "../controllers/activitiesController.js";

export const router = Router();

router.get("/all/", getAllActivities)
router.put("/favorite/", updateFavorite);