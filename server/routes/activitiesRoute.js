import { Router } from 'express';
import { getAllActivities, getActivity, updateFavorite } from '../controllers/activitiesController.js';

export const router = Router();

router.get('/all', getAllActivities);
router.get('/', getAllActivities);
router.get('/:id', getActivity);
router.put('/favorite', updateFavorite);