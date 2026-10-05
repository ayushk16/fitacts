import { Router } from 'express';
import { creatUserController, getUsers, checkUsernameAvailability } from '../controllers/signUpController.js';

export const router = Router();

router.get('/check-username', checkUsernameAvailability);
router.get('/', getUsers);
router.post('/', creatUserController);