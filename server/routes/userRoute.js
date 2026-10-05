import { Router } from 'express';
import {
  getAllUsers,
  getUserProfile,
  updateUser,
  following,
  pending,
  follow,
  unfollow,
  getAadhar,
  addPendingRequest,
  requests,
} from '../controllers/userController.js';
import { authCheck } from '../midlewares/authCheck.js';

export const router = Router();

router.get('/all', getAllUsers);
router.get('/', getAllUsers);
router.get('/profile/:identifier', getUserProfile);
router.put('/', updateUser);
router.get('/following', following);
router.get('/pending', pending);
router.put('/follow', follow);
router.delete('/unfollow', unfollow);
router.post('/addPending', addPendingRequest);
router.get('/requests', requests);
router.get('/aadhar', authCheck, getAadhar);