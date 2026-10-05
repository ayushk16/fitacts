import { eq, and, or, sql, desc } from 'drizzle-orm';
import { db } from '../app/config/dbConfig.js';
import { users, followdata, aadhaar, events, activities } from '../db/schema.js';

// Get all users with relationship status relative to requesting user
export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = parseInt(req.query.currentUserId || req.user?.id, 10);

    const userList = await db
      .select({
        id: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        aadharpresent: users.aadharpresent,
        favorites: users.favorites,
        created_at: users.created_at,
      })
      .from(users);

    if (!currentUserId) {
      return res.status(200).json({ data: userList, message: 'Users fetched successfully' });
    }

    // Attach relationship state
    const usersWithRelation = await Promise.all(
      userList.map(async (u) => {
        if (u.id === currentUserId) {
          return { ...u, relationship: 'self' };
        }

        const relation = await db
          .select()
          .from(followdata)
          .where(
            or(
              and(eq(followdata.followerid, currentUserId), eq(followdata.followingid, u.id)),
              and(eq(followdata.followerid, u.id), eq(followdata.followingid, currentUserId))
            )
          )
          .limit(1);

        let relationship = 'none';
        if (relation.length > 0) {
          if (relation[0].state === 'followed') {
            relationship = 'friend';
          } else if (relation[0].followerid === currentUserId) {
            relationship = 'pending_sent';
          } else {
            relationship = 'pending_received';
          }
        }

        return { ...u, relationship };
      })
    );

    res.status(200).json({ data: usersWithRelation, message: 'Users fetched successfully' });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    next(error);
  }
};

// Get a user profile with their latest posts (all if friend, max 5 if not friend)
export const getUserProfile = async (req, res, next) => {
  try {
    const identifier = req.params.identifier || req.query.username || req.query.id;
    const currentUserId = parseInt(req.query.currentUserId || req.user?.id, 10);

    if (!identifier) {
      return res.status(400).json({ message: 'User identifier is required' });
    }

    const isNumeric = /^\d+$/.test(identifier);
    const targetUser = await db
      .select({
        id: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        aadharpresent: users.aadharpresent,
        favorites: users.favorites,
        created_at: users.created_at,
      })
      .from(users)
      .where(isNumeric ? eq(users.id, parseInt(identifier, 10)) : eq(users.username, identifier))
      .limit(1);

    if (targetUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = targetUser[0];
    const isSelf = currentUserId === user.id;

    let relationship = isSelf ? 'self' : 'none';
    if (!isSelf && currentUserId) {
      const relation = await db
        .select()
        .from(followdata)
        .where(
          or(
            and(eq(followdata.followerid, currentUserId), eq(followdata.followingid, user.id)),
            and(eq(followdata.followerid, user.id), eq(followdata.followingid, currentUserId))
          )
        )
        .limit(1);

      if (relation.length > 0) {
        if (relation[0].state === 'followed') {
          relationship = 'friend';
        } else if (relation[0].followerid === currentUserId) {
          relationship = 'pending_sent';
        } else {
          relationship = 'pending_received';
        }
      }
    }

    const isFriendOrSelf = relationship === 'friend' || relationship === 'self';

    // Fetch user's workout posts: all if friend or self, only 5 latest if not friend!
    const postLimit = isFriendOrSelf ? 50 : 5;

    const userPosts = await db
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
      .where(and(eq(events.userid, user.id), eq(events.showintimeline, true)))
      .orderBy(desc(events.created_at))
      .limit(postLimit);

    res.status(200).json({
      data: {
        user,
        relationship,
        isFriend: relationship === 'friend',
        posts: userPosts,
        limitedView: !isFriendOrSelf,
      },
      message: 'Profile fetched successfully',
    });
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    next(error);
  }
};

// Update user aadhaar
export const updateUser = async (req, res, next) => {
  try {
    const { userid, aadhardata } = req.body;
    const parsedUserId = parseInt(userid || req.user?.id, 10);

    if (!parsedUserId || !aadhardata) {
      return res.status(400).json({ message: 'User ID and Aadhaar data are required' });
    }

    // Update user's aadharpresent flag
    const updatedUsers = await db
      .update(users)
      .set({ aadharpresent: true })
      .where(eq(users.id, parsedUserId))
      .returning();

    if (updatedUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upsert into aadhaar table
    const existingAadhaar = await db
      .select()
      .from(aadhaar)
      .where(eq(aadhaar.userid, parsedUserId))
      .limit(1);

    if (existingAadhaar.length > 0) {
      await db
        .update(aadhaar)
        .set({ storageinfo: String(aadhardata) })
        .where(eq(aadhaar.userid, parsedUserId));
    } else {
      await db
        .insert(aadhaar)
        .values({ userid: parsedUserId, storageinfo: String(aadhardata) });
    }

    res.status(200).json({
      data: updatedUsers[0],
      message: 'User Aadhaar updated successfully',
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    next(error);
  }
};

// Following list (friends / followed accounts)
export const following = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userid || req.user?.id, 10);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const followingData = await db
      .select({
        id: users.id,
        followeduserid: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        state: followdata.state,
      })
      .from(followdata)
      .innerJoin(users, eq(followdata.followingid, users.id))
      .where(and(eq(followdata.followerid, userId), eq(followdata.state, 'followed')));

    res.status(200).json({ data: followingData, message: 'Following fetched successfully' });
  } catch (error) {
    console.error('Error in following:', error);
    next(error);
  }
};

// Pending requests sent by current user
export const pending = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userid || req.user?.id, 10);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const pendingData = await db
      .select({
        id: users.id,
        followeduserid: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        state: followdata.state,
      })
      .from(followdata)
      .innerJoin(users, eq(followdata.followingid, users.id))
      .where(and(eq(followdata.followerid, userId), eq(followdata.state, 'pending')));

    res.status(200).json({ data: pendingData, message: 'Pending requests fetched successfully' });
  } catch (error) {
    console.error('Error in pending:', error);
    next(error);
  }
};

// Incoming friend requests received by current user
export const requests = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userid || req.user?.id, 10);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const incomingRequests = await db
      .select({
        id: users.id,
        followeruserid: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        state: followdata.state,
      })
      .from(followdata)
      .innerJoin(users, eq(followdata.followerid, users.id))
      .where(and(eq(followdata.followingid, userId), eq(followdata.state, 'pending')));

    res.status(200).json({ data: incomingRequests, message: 'Requests fetched successfully' });
  } catch (error) {
    console.error('Error in requests:', error);
    next(error);
  }
};

// Send a friend / follow request
export const addPendingRequest = async (req, res, next) => {
  try {
    const followerid = parseInt(req.body.followerid || req.user?.id, 10);
    const followedid = parseInt(req.body.followedid, 10);

    if (!followerid || !followedid) {
      return res.status(400).json({ message: 'Both followerid and followedid are required' });
    }

    if (followerid === followedid) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    const existing = await db
      .select()
      .from(followdata)
      .where(and(eq(followdata.followerid, followerid), eq(followdata.followingid, followedid)))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(followdata).values({
        followerid,
        followingid: followedid,
        state: 'pending',
      });
    } else {
      await db
        .update(followdata)
        .set({ state: 'pending' })
        .where(eq(followdata.id, existing[0].id));
    }

    const followedUser = await db.select().from(users).where(eq(users.id, followedid)).limit(1);

    res.status(200).json({
      data: followedUser[0],
      message: 'Friend request sent',
    });
  } catch (error) {
    console.error('Error in addPendingRequest:', error);
    next(error);
  }
};

// Accept friend request / follow back
export const follow = async (req, res, next) => {
  try {
    const followerid = parseInt(req.body.followerid, 10); // person who sent the request
    const followedid = parseInt(req.body.followedid || req.user?.id, 10); // current user accepting

    if (!followerid || !followedid) {
      return res.status(400).json({ message: 'Both followerid and followedid are required' });
    }

    // Set incoming request to 'followed'
    await db
      .update(followdata)
      .set({ state: 'followed' })
      .where(and(eq(followdata.followerid, followerid), eq(followdata.followingid, followedid)));

    // Also ensure mutual followed record so both users are friends
    const reverse = await db
      .select()
      .from(followdata)
      .where(and(eq(followdata.followerid, followedid), eq(followdata.followingid, followerid)))
      .limit(1);

    if (reverse.length === 0) {
      await db.insert(followdata).values({
        followerid: followedid,
        followingid: followerid,
        state: 'followed',
      });
    } else {
      await db
        .update(followdata)
        .set({ state: 'followed' })
        .where(eq(followdata.id, reverse[0].id));
    }

    const otherUser = await db.select().from(users).where(eq(users.id, followerid)).limit(1);

    res.status(200).json({
      data: otherUser[0],
      message: 'Friend request accepted',
    });
  } catch (error) {
    console.error('Error in follow:', error);
    next(error);
  }
};

// Unfollow / remove friend / cancel request
export const unfollow = async (req, res, next) => {
  try {
    const followerid = parseInt(req.query.followerid || req.body.followerid || req.user?.id, 10);
    const followedid = parseInt(req.query.followedid || req.body.followedid, 10);

    if (!followerid || !followedid) {
      return res.status(400).json({ message: 'Both followerid and followedid are required' });
    }

    // Delete relationships both directions
    await db
      .delete(followdata)
      .where(
        or(
          and(eq(followdata.followerid, followerid), eq(followdata.followingid, followedid)),
          and(eq(followdata.followerid, followedid), eq(followdata.followingid, followerid))
        )
      );

    res.status(200).json({
      data: { followerid, followedid },
      message: 'Unfollowed successfully',
    });
  } catch (error) {
    console.error('Error in unfollow:', error);
    next(error);
  }
};

// Get aadhaar data
export const getAadhar = async (req, res, next) => {
  try {
    const userId = parseInt(req.query.userid || req.user?.id, 10);
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const aadharRecord = await db
      .select()
      .from(aadhaar)
      .where(eq(aadhaar.userid, userId))
      .limit(1);

    if (aadharRecord.length === 0) {
      return res.status(404).json({ message: 'Aadhaar data not found' });
    }

    res.status(200).json({
      data: aadharRecord[0],
      message: 'Aadhaar data fetched successfully',
    });
  } catch (error) {
    console.error('Error in getAadhar:', error);
    next(error);
  }
};