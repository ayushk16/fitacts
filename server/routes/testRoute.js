import { Router } from "express";
import { testquery } from "../controllers/testController.js"

export const router = Router();

router.get("/", testquery);
