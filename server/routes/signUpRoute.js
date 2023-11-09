import { Router } from "express";
import midlewares from "../midlewares/index.js";
import controllers from "../controllers/index.js";

export const router = Router();

router.get("/", controllers.getUsers);
router.post("/", midlewares.checkUserExist, controllers.creatUserController);