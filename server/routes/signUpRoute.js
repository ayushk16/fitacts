import { Router } from "express";
import { checkUserExist, checkPhoneExist } from "../midlewares/signupCheck.js";

import { creatUserController, getUsers } from "../controllers/signUpController.js";
export const router = Router();

router.get("/", getUsers);
router.post("/", checkUserExist, checkPhoneExist, creatUserController);