import { Router } from "express";
import { getAllEvents, createEvent, updateEvent, getTopEvents, getEventsBreakdown } from "../controllers/eventsController.js";

export const router = Router();

router.get("/", getAllEvents);
router.post("/", createEvent);
router.put("/", updateEvent);
router.get("/top/", getTopEvents);
router.get("/breakdown/", getEventsBreakdown);