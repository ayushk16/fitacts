import { Router } from "express";
import controllers from "../controllers/index.js";
import { authCheck } from "../midlewares/authCheck.js";

export const router = Router();

// router.get("/", authCheck, controllers.getAllActivities);
router.get("/", controllers.getAllEvents);
router.post("/", controllers.createEvent);