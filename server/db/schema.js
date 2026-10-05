import { pgTable, serial, varchar, text, boolean, integer, doublePrecision, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table with serial primary key, unique email, and unique username
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  firstname: varchar('firstname', { length: 100 }).notNull(),
  lastname: varchar('lastname', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  password: varchar('password', { length: 255 }).notNull(),
  aadharpresent: boolean('aadharpresent').default(false).notNull(),
  favorites: text('favorites').array(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Activities reference table
export const activities = pgTable('activities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  distanceunit: varchar('distanceunit', { length: 20 }).default('km').notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Events / Activities recorded by users
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  userid: integer('userid').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  activityid: integer('activityid').references(() => activities.id),
  distance: doublePrecision('distance').notNull().default(0),
  duration: integer('duration').notNull().default(0), // in seconds
  showintimeline: boolean('showintimeline').default(true).notNull(),
  image_url: text('image_url'), // S3 URL or fallback formatted string
  caption: text('caption'), // Post caption
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Likes on workout posts
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  eventid: integer('eventid').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userid: integer('userid').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Comments on workout posts
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  eventid: integer('eventid').references(() => events.id, { onDelete: 'cascade' }).notNull(),
  userid: integer('userid').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Follower / Friend relationships
export const followdata = pgTable('followdata', {
  id: serial('id').primaryKey(),
  followerid: integer('followerid').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingid: integer('followingid').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  state: varchar('state', { length: 20 }).default('pending').notNull(), // 'pending', 'followed', 'rejected'
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Aadhaar validation record (fixing silly schema typos like 'adhaars')
export const aadhaar = pgTable('aadhaar', {
  id: serial('id').primaryKey(),
  userid: integer('userid').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  storageinfo: text('storageinfo').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  events: many(events),
  likes: many(likes),
  comments: many(comments),
  aadhaar: one(aadhaar, {
    fields: [users.id],
    references: [aadhaar.userid],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, {
    fields: [events.userid],
    references: [users.id],
  }),
  activity: one(activities, {
    fields: [events.activityid],
    references: [activities.id],
  }),
  likes: many(likes),
  comments: many(comments),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  event: one(events, {
    fields: [likes.eventid],
    references: [events.id],
  }),
  user: one(users, {
    fields: [likes.userid],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  event: one(events, {
    fields: [comments.eventid],
    references: [events.id],
  }),
  user: one(users, {
    fields: [comments.userid],
    references: [users.id],
  }),
}));
