import { Router } from "express";
import { updateUser, following, follow, unfollow, getAadhar } from "../controllers/userController.js";

export const router = Router();

router.put('/', updateUser);
router.get("/following/", following);
router.post("/follow/", follow);
router.delete("/unfollow/", unfollow);
router.get("/aadhar", getAadhar);