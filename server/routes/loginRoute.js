import { Router } from "express";
import { loginController } from "../controllers/loginController.js";

export const router = Router();

router.get("/", loginController);
