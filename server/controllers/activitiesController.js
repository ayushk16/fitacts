import { eq } from 'drizzle-orm';
import { db } from '../app/config/dbConfig.js';
import { activities, users } from '../db/schema.js';

export const getAllActivities = async (req, res, next) => {
  try {
    const list = await db.select().from(activities);
    res.status(200).json({ data: list, message: 'Activities fetched successfully' });
  } catch (error) {
    console.error('Error in getAllActivities:', error);
    next(error);
  }
};

export const getActivity = async (req, res, next) => {
  try {
    const activityId = parseInt(req.query.activityId || req.params.id, 10);
    if (!activityId || isNaN(activityId)) {
      return res.status(400).json({ message: 'Activity ID is required' });
    }

    const item = await db.select().from(activities).where(eq(activities.id, activityId)).limit(1);

    if (item.length === 0) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json({ data: item[0], message: 'Activity fetched successfully' });
  } catch (error) {
    console.error('Error in getActivity:', error);
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { userId, activityId, value } = req.body;
    const parsedUserId = parseInt(userId || req.user?.id, 10);
    const actIdStr = String(activityId);

    if (!parsedUserId || !actIdStr || value === undefined) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    const userRecord = await db.select().from(users).where(eq(users.id, parsedUserId)).limit(1);
    if (userRecord.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let favorites = userRecord[0].favorites || [];
    const isAdding = value === true || value === 'true';

    if (isAdding) {
      if (!favorites.includes(actIdStr)) {
        favorites = [...favorites, actIdStr];
      }
    } else {
      favorites = favorites.filter((id) => id !== actIdStr);
    }

    const updated = await db
      .update(users)
      .set({ favorites })
      .where(eq(users.id, parsedUserId))
      .returning();

    const { password: _, ...userSafe } = updated[0];

    res.status(200).json({ data: userSafe, message: 'Favorites updated successfully' });
  } catch (error) {
    console.error('Error in updateFavorite:', error);
    next(error);
  }
};
