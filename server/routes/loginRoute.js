import { Router } from 'express';
import { loginController, refreshTokenController } from '../controllers/loginController.js';

export const router = Router();

router.post('/', loginController);
router.get('/', loginController); // Keep GET for backward compatibility
router.post('/refresh', refreshTokenController);
