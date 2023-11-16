import { Router } from "express";
import controllers from "../controllers/index.js";

export const router = Router();

// router.get("/", authCheck, controllers.getAllActivities);
router.get("/", controllers.getAllEvents);
router.post("/", controllers.createEvent);
router.put("/", controllers.updateEvent);
router.get("/top/", controllers.getTopEvents);