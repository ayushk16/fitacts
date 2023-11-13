import { Router } from "express";
import controllers from "../controllers/index.js";

export const router = Router();

router.get("/", controllers.getUser);
