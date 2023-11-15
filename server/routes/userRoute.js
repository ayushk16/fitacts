import { Router } from "express";
import controllers from "../controllers/index.js";

export const router = Router();

router.get("/", controllers.getUser);
router.put('/', controllers.updateUser);
router.get("/following/", controllers.following);
router.post("/follow/", controllers.follow);
router.delete("/unfollow/", controllers.unfollow);