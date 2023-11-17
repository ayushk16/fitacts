import { Router } from "express";
import { getUser, updateUser, following, follow, unfollow, getAadhar } from "../controllers/userController.js";

export const router = Router();

router.get("/", getUser);
router.put('/', updateUser);
router.get("/following/", following);
router.post("/follow/", follow);
router.delete("/unfollow/", unfollow);
router.get("/aadhar", getAadhar);