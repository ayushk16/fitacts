import { Router } from 'express';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getTopEvents,
  getEventsBreakdown,
  getSocialFeed,
  toggleLike,
  getEventLikes,
  addComment,
  getComments,
} from '../controllers/eventsController.js';

export const router = Router();

router.get('/', getAllEvents);
router.post('/', createEvent);
router.put('/', updateEvent);
router.delete('/:id', deleteEvent);
router.delete('/', deleteEvent);

router.get('/top', getTopEvents);
router.get('/breakdown', getEventsBreakdown);
router.get('/feed', getSocialFeed);

// Likes
router.post('/:id/like', toggleLike);
router.post('/like', toggleLike);
router.get('/:id/likes', getEventLikes);

// Comments
router.post('/:id/comments', addComment);
router.post('/comments', addComment);
router.get('/:id/comments', getComments);