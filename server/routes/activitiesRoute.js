import { Router } from "express";
import controllers from "../controllers/index.js";
import { authCheck } from "../midlewares/authCheck.js";

export const router = Router();

router.get("/all/", controllers.getAllActivities)
router.get("/one/", controllers.getActivity);
router.put("/favorite/", controllers.updateFavorite);
router.get("/favorite/:id", controllers.getUserFavorites);