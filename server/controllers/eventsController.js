import { eq, and, desc, sql, inArray, notInArray, or } from 'drizzle-orm';
import { db } from '../app/config/dbConfig.js';
import { events, activities, users, likes, comments, followdata } from '../db/schema.js';
import { generateFallbackImageUrl } from '../services/s3Service.js';

// Get all events for a user (for dashboard)
export const getAllEvents = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.id || req.user?.id, 10);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'User ID is required', status: 'missing_user_id' });
    }

    const userEvents = await db
      .select({
        id: events.id,
        eventid: events.id,
        name: events.name,
        eventname: events.name,
        userid: events.userid,
        activityid: events.activityid,
        distance: events.distance,
        duration: events.duration,
        showintimeline: events.showintimeline,
        image_url: events.image_url,
        caption: events.caption,
        created_at: events.created_at,
        timestamp: events.created_at,
        activityname: activities.name,
        distanceunit: activities.distanceunit,
        icon: activities.icon,
      })
      .from(events)
      .leftJoin(activities, eq(events.activityid, activities.id))
      .where(eq(events.userid, userId))
      .orderBy(desc(events.created_at));

    res.status(200).json({ data: userEvents, message: 'Events fetched successfully' });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    next(error);
  }
};

// Create a new fitness activity record / post
export const createEvent = async (req, res, next) => {
  try {
    const { name, userid, activityid, distance, duration, showintimeline, image_url, caption } = req.body;

    const parsedUserId = parseInt(userid || req.user?.id, 10);
    const parsedActivityId = parseInt(activityid, 10);

    if (!name || !parsedUserId || !parsedActivityId) {
      return res.status(400).json({ message: 'Missing required event fields', status: 'missing_fields' });
    }

    // Fetch user and activity details to generate proper fallback image string if not provided
    const userRecord = await db.select().from(users).where(eq(users.id, parsedUserId)).limit(1);
    const activityRecord = await db.select().from(activities).where(eq(activities.id, parsedActivityId)).limit(1);

    const username = userRecord.length > 0 ? userRecord[0].username : 'athlete';
    const activityName = activityRecord.length > 0 ? activityRecord[0].name : 'workout';

    // Store cloud storage image URL if provided, otherwise store unique string username + activity + unique_string
    const finalImageUrl = image_url && image_url.trim()
      ? image_url.trim()
      : generateFallbackImageUrl(username, activityName);

    const newEventRows = await db
      .insert(events)
      .values({
        name: name.trim(),
        userid: parsedUserId,
        activityid: parsedActivityId,
        distance: parseFloat(distance) || 0,
        duration: parseInt(duration, 10) || 0,
        showintimeline: showintimeline !== undefined ? Boolean(showintimeline) : true,
        image_url: finalImageUrl,
        caption: caption ? caption.trim() : null,
      })
      .returning();

    const createdEvent = newEventRows[0];

    // Fetch complete event with activity info
    const fullEvent = await db
      .select({
        id: events.id,
        eventid: events.id,
        name: events.name,
        eventname: events.name,
        userid: events.userid,
        activityid: events.activityid,
        distance: events.distance,
        duration: events.duration,
        showintimeline: events.showintimeline,
        image_url: events.image_url,
        caption: events.caption,
        created_at: events.created_at,
        timestamp: events.created_at,
        activityname: activities.name,
        distanceunit: activities.distanceunit,
        icon: activities.icon,
      })
      .from(events)
      .leftJoin(activities, eq(events.activityid, activities.id))
      .where(eq(events.id, createdEvent.id))
      .limit(1);

    res.status(200).json({ data: fullEvent[0], message: 'Event created successfully' });
  } catch (error) {
    console.error('Error in createEvent:', error);
    next(error);
  }
};

// Delete an event record (User requested delete functionality in dashboard)
export const deleteEvent = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id || req.query.id || req.body.eventid, 10);
    const userId = parseInt(req.body.userid || req.query.userid || req.user?.id, 10);

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ message: 'Event ID is required', status: 'missing_id' });
    }

    // Verify ownership if userId is available
    const existing = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (userId && existing[0].userid !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this record' });
    }

    await db.delete(events).where(eq(events.id, eventId));

    res.status(200).json({ data: { id: eventId }, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    next(error);
  }
};

// Update event visibility (show in timeline)
export const updateEvent = async (req, res, next) => {
  try {
    const { userid, eventid, showintimeline } = req.body;
    const parsedEventId = parseInt(eventid, 10);
    const parsedUserId = parseInt(userid || req.user?.id, 10);

    if (isNaN(parsedEventId) || showintimeline === undefined) {
      return res.status(400).json({ message: 'Missing eventid or showintimeline' });
    }

    const updated = await db
      .update(events)
      .set({ showintimeline: Boolean(showintimeline) })
      .where(
        parsedUserId
          ? and(eq(events.id, parsedEventId), eq(events.userid, parsedUserId))
          : eq(events.id, parsedEventId)
      )
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ message: 'Event not found or not owned by user' });
    }

    const returnEvent = await db
      .select({
        id: events.id,
        eventid: events.id,
        name: events.name,
        eventname: events.name,
        userid: events.userid,
        activityid: events.activityid,
        distance: events.distance,
        duration: events.duration,
        showintimeline: events.showintimeline,
        image_url: events.image_url,
        caption: events.caption,
        created_at: events.created_at,
        timestamp: events.created_at,
        activityname: activities.name,
        distanceunit: activities.distanceunit,
        icon: activities.icon,
      })
      .from(events)
      .leftJoin(activities, eq(events.activityid, activities.id))
      .where(eq(events.id, updated[0].id))
      .limit(1);

    res.status(200).json({ data: returnEvent[0], message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    next(error);
  }
};

// Get top events by distance for an activity
export const getTopEvents = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userId || req.query.id, 10);
    const activityId = parseInt(req.query.activityId, 10);

    if (!userId || !activityId) {
      return res.status(400).json({ message: 'User ID and Activity ID are required' });
    }

    const topList = await db
      .select({
        id: events.id,
        eventid: events.id,
        name: events.name,
        eventname: events.name,
        userid: events.userid,
        activityid: events.activityid,
        distance: events.distance,
        duration: events.duration,
        showintimeline: events.showintimeline,
        image_url: events.image_url,
        caption: events.caption,
        created_at: events.created_at,
        timestamp: events.created_at,
        activityname: activities.name,
        distanceunit: activities.distanceunit,
        icon: activities.icon,
      })
      .from(events)
      .leftJoin(activities, eq(events.activityid, activities.id))
      .where(and(eq(events.userid, userId), eq(events.activityid, activityId)))
      .orderBy(desc(events.distance))
      .limit(5);

    res.status(200).json({ data: topList, message: 'Top events fetched successfully' });
  } catch (error) {
    next(error);
  }
};

// Get timeline breakdown with pagination
export const getEventsBreakdown = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.id || req.query.userId, 10);
    const limit = parseInt(req.query.limit || 5, 10);
    const offset = parseInt(req.query.offset || 0, 10);
    const viewerId = parseInt(req.query.viewerId || req.user?.id, 10);

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if viewer and target user are friends
    let isFriend = userId === viewerId;
    if (!isFriend && viewerId) {
      const friendship = await db
        .select()
        .from(followdata)
        .where(
          and(
            eq(followdata.state, 'followed'),
            or(
              and(eq(followdata.followerid, viewerId), eq(followdata.followingid, userId)),
              and(eq(followdata.followerid, userId), eq(followdata.followingid, viewerId))
            )
          )
        )
        .limit(1);
      if (friendship.length > 0) isFriend = true;
    }

    // Requirement: Non-friends can see only 5 latest posts!
    const effectiveLimit = !isFriend && limit > 5 ? 5 : limit;

    const eventRows = await db
      .select({
        id: events.id,
        eventid: events.id,
        name: events.name,
        eventname: events.name,
        userid: events.userid,
        activityid: events.activityid,
        distance: events.distance,
        duration: events.duration,
        showintimeline: events.showintimeline,
        image_url: events.image_url,
        caption: events.caption,
        created_at: events.created_at,
        timestamp: events.created_at,
        activityname: activities.name,
        distanceunit: activities.distanceunit,
        icon: activities.icon,
      })
      .from(events)
      .leftJoin(activities, eq(events.activityid, activities.id))
      .where(and(eq(events.userid, userId), eq(events.showintimeline, true)))
      .orderBy(desc(events.created_at))
      .limit(effectiveLimit)
      .offset(offset);

    // Get total count
    const totalEvents = await db
      .select({ count: sql`count(*)` })
      .from(events)
      .where(and(eq(events.userid, userId), eq(events.showintimeline, true)));

    const totalCount = !isFriend ? Math.min(5, parseInt(totalEvents[0].count, 10)) : parseInt(totalEvents[0].count, 10);

    res.status(200).json({
      data: {
        events: eventRows,
        length: totalCount,
        isFriend,
        limitedView: !isFriend,
      },
      message: 'Events breakdown fetched successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Social Feed: Displays all friends' latest activities + discovery posts (max 5 for non-friends)
export const getSocialFeed = async (req, res, next) => {
  try {
    const currentUserId = parseInt(req.query.userId || req.user?.id, 10);
    if (!currentUserId || isNaN(currentUserId)) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // 1. Find all friends (state = 'followed')
    const friendRelations = await db
      .select({
        friendId: sql`CASE WHEN followerid = ${currentUserId} THEN followingid ELSE followerid END`,
      })
      .from(followdata)
      .where(
        and(
          eq(followdata.state, 'followed'),
          or(eq(followdata.followerid, currentUserId), eq(followdata.followingid, currentUserId))
        )
      );

    const friendIds = friendRelations.map((r) => parseInt(r.friendId, 10)).filter(Boolean);
    const feedUserIds = [currentUserId, ...friendIds];

    // 2. Fetch friends' and user's posts
    const friendPosts = await db
      .select({
        id: events.id,
        eventid: events.id,
        name: events.name,
        eventname: events.name,
        userid: events.userid,
        activityid: events.activityid,
        distance: events.distance,
        duration: events.duration,
        showintimeline: events.showintimeline,
        image_url: events.image_url,
        caption: events.caption,
        created_at: events.created_at,
        timestamp: events.created_at,
        activityname: activities.name,
        distanceunit: activities.distanceunit,
        icon: activities.icon,
        authorUsername: users.username,
        authorFirstname: users.firstname,
        authorLastname: users.lastname,
      })
      .from(events)
      .leftJoin(activities, eq(events.activityid, activities.id))
      .leftJoin(users, eq(events.userid, users.id))
      .where(and(inArray(events.userid, feedUserIds), eq(events.showintimeline, true)))
      .orderBy(desc(events.created_at))
      .limit(30);

    // 3. Fetch discovery posts from non-friends (limit 5 latest posts as requested!)
    let nonFriendPosts = [];
    if (friendIds.length >= 0) {
      nonFriendPosts = await db
        .select({
          id: events.id,
          eventid: events.id,
          name: events.name,
          eventname: events.name,
          userid: events.userid,
          activityid: events.activityid,
          distance: events.distance,
          duration: events.duration,
          showintimeline: events.showintimeline,
          image_url: events.image_url,
          caption: events.caption,
          created_at: events.created_at,
          timestamp: events.created_at,
          activityname: activities.name,
          distanceunit: activities.distanceunit,
          icon: activities.icon,
          authorUsername: users.username,
          authorFirstname: users.firstname,
          authorLastname: users.lastname,
        })
        .from(events)
        .leftJoin(activities, eq(events.activityid, activities.id))
        .leftJoin(users, eq(events.userid, users.id))
        .where(and(notInArray(events.userid, feedUserIds), eq(events.showintimeline, true)))
        .orderBy(desc(events.created_at))
        .limit(5); // Non-friends max 5 latest posts
    }

    const allFeedPosts = [...friendPosts, ...nonFriendPosts];

    // Attach like counts, isLikedByMe, and comments count to each post
    const enrichedPosts = await Promise.all(
      allFeedPosts.map(async (post) => {
        const likesCountRes = await db
          .select({ count: sql`count(*)` })
          .from(likes)
          .where(eq(likes.eventid, post.id));

        const myLike = await db
          .select()
          .from(likes)
          .where(and(eq(likes.eventid, post.id), eq(likes.userid, currentUserId)))
          .limit(1);

        const commentsRes = await db
          .select({
            id: comments.id,
            content: comments.content,
            created_at: comments.created_at,
            userid: comments.userid,
            username: users.username,
            firstname: users.firstname,
            lastname: users.lastname,
          })
          .from(comments)
          .leftJoin(users, eq(comments.userid, users.id))
          .where(eq(comments.eventid, post.id))
          .orderBy(desc(comments.created_at))
          .limit(3);

        const totalCommentsRes = await db
          .select({ count: sql`count(*)` })
          .from(comments)
          .where(eq(comments.eventid, post.id));

        const isAuthorFriend = friendIds.includes(post.userid) || post.userid === currentUserId;

        return {
          ...post,
          likesCount: parseInt(likesCountRes[0]?.count || 0, 10),
          isLiked: myLike.length > 0,
          isFriend: isAuthorFriend,
          recentComments: commentsRes,
          commentsCount: parseInt(totalCommentsRes[0]?.count || 0, 10),
        };
      })
    );

    res.status(200).json({ data: enrichedPosts, message: 'Feed loaded successfully' });
  } catch (error) {
    console.error('Error in getSocialFeed:', error);
    next(error);
  }
};

// Toggle Like on an event post
export const toggleLike = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id || req.body.eventid, 10);
    const userId = parseInt(req.body.userid || req.user?.id, 10);

    if (!eventId || !userId) {
      return res.status(400).json({ message: 'Event ID and User ID are required' });
    }

    const existingLike = await db
      .select()
      .from(likes)
      .where(and(eq(likes.eventid, eventId), eq(likes.userid, userId)))
      .limit(1);

    let isLiked = false;
    if (existingLike.length > 0) {
      await db.delete(likes).where(eq(likes.id, existingLike[0].id));
      isLiked = false;
    } else {
      await db.insert(likes).values({ eventid: eventId, userid: userId });
      isLiked = true;
    }

    const countRes = await db
      .select({ count: sql`count(*)` })
      .from(likes)
      .where(eq(likes.eventid, eventId));

    res.status(200).json({
      data: {
        isLiked,
        likesCount: parseInt(countRes[0]?.count || 0, 10),
        eventId,
      },
      message: isLiked ? 'Post liked' : 'Post unliked',
    });
  } catch (error) {
    console.error('Error in toggleLike:', error);
    next(error);
  }
};

// Get list of users who liked an event post
export const getEventLikes = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const currentUserId = parseInt(req.query.currentUserId || req.user?.id, 10);

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const likers = await db
      .select({
        id: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        liked_at: likes.created_at,
      })
      .from(likes)
      .innerJoin(users, eq(likes.userid, users.id))
      .where(eq(likes.eventid, eventId))
      .orderBy(desc(likes.created_at));

    // Determine relationship of each liker with current user
    const likersWithStatus = await Promise.all(
      likers.map(async (liker) => {
        if (!currentUserId || liker.id === currentUserId) {
          return { ...liker, relationship: 'self' };
        }

        const followRecord = await db
          .select()
          .from(followdata)
          .where(
            or(
              and(eq(followdata.followerid, currentUserId), eq(followdata.followingid, liker.id)),
              and(eq(followdata.followerid, liker.id), eq(followdata.followingid, currentUserId))
            )
          )
          .limit(1);

        let relationship = 'none';
        if (followRecord.length > 0) {
          if (followRecord[0].state === 'followed') {
            relationship = 'friend';
          } else if (followRecord[0].followerid === currentUserId) {
            relationship = 'pending_sent';
          } else {
            relationship = 'pending_received';
          }
        }

        return { ...liker, relationship };
      })
    );

    res.status(200).json({ data: likersWithStatus, message: 'Likes fetched successfully' });
  } catch (error) {
    console.error('Error in getEventLikes:', error);
    next(error);
  }
};

// Add a comment to an event post
export const addComment = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id || req.body.eventid, 10);
    const userId = parseInt(req.body.userid || req.user?.id, 10);
    const { content } = req.body;

    if (!eventId || !userId || !content || !content.trim()) {
      return res.status(400).json({ message: 'Event ID, User ID, and comment content are required' });
    }

    const inserted = await db
      .insert(comments)
      .values({
        eventid: eventId,
        userid: userId,
        content: content.trim(),
      })
      .returning();

    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    const commentData = {
      ...inserted[0],
      username: user[0]?.username,
      firstname: user[0]?.firstname,
      lastname: user[0]?.lastname,
    };

    res.status(200).json({ data: commentData, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error in addComment:', error);
    next(error);
  }
};

// Get all comments for an event post
export const getComments = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    const postComments = await db
      .select({
        id: comments.id,
        content: comments.content,
        created_at: comments.created_at,
        userid: comments.userid,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userid, users.id))
      .where(eq(comments.eventid, eventId))
      .orderBy(desc(comments.created_at));

    res.status(200).json({ data: postComments, message: 'Comments fetched successfully' });
  } catch (error) {
    console.error('Error in getComments:', error);
    next(error);
  }
};