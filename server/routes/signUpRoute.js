import { Router } from "express";
import { checkUserExist } from "../midlewares/signupCheck.js";

import { creatUserController, getUsers } from "../controllers/signUpController.js";
export const router = Router();

router.get("/", getUsers);
router.post("/", checkUserExist, creatUserController);