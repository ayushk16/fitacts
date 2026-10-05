import bcrypt from 'bcryptjs';
import { eq, ilike } from 'drizzle-orm';
import { db } from '../app/config/dbConfig.js';
import { users } from '../db/schema.js';
import { getToken } from '../functions/jwtAuth.js';
import { decryptPayload } from '../utility/crypto.js';

export const checkUsernameAvailability = async (req, res, next) => {
  try {
    const rawUsername = req.query.username;
    if (!rawUsername || !rawUsername.trim()) {
      return res.status(400).json({
        available: false,
        message: 'Username cannot be empty',
      });
    }

    const username = rawUsername.trim().toLowerCase();

    // Check username format (alphanumeric and underscores, 3-20 chars)
    const validUsernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!validUsernamePattern.test(username)) {
      return res.status(200).json({
        available: false,
        message: 'Must be 3-20 characters (letters, numbers, underscores)',
      });
    }

    const existingUsers = await db
      .select({ id: users.id, username: users.username })
      .from(users)
      .where(ilike(users.username, username))
      .limit(1);

    if (existingUsers.length > 0) {
      return res.status(200).json({
        available: false,
        message: 'Username is already taken',
      });
    }

    return res.status(200).json({
      available: true,
      message: 'Username is available!',
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        email: users.email,
        phone: users.phone,
        favorites: users.favorites,
        created_at: users.created_at,
      })
      .from(users);

    res.status(200).json({ data: allUsers, message: 'Users fetched successfully' });
  } catch (error) {
    next(error);
  }
};

export const creatUserController = async (req, res, next) => {
  try {
    // Decrypt in case frontend sent encrypted credentials
    const decryptedBody = decryptPayload(req.body);
    const { firstname, lastname, username, email, phone, password } = decryptedBody;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: 'First name, last name, email, and password are required',
      });
    }

    // Default username if not provided
    const userHandle = (username || `${firstname.toLowerCase()}_${Date.now().toString(36)}`).trim().toLowerCase();

    // Check if email already exists
    const existingEmail = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (existingEmail.length > 0) {
      return res.status(400).json({
        message: 'Email already exists',
        status: 'email_exists',
      });
    }

    // Check if username already exists
    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(ilike(users.username, userHandle))
      .limit(1);

    if (existingUsername.length > 0) {
      return res.status(400).json({
        message: 'Username already exists',
        status: 'username_exists',
      });
    }

    // Check if phone already exists
    if (phone && phone.trim()) {
      const existingPhone = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.phone, phone.trim()))
        .limit(1);

      if (existingPhone.length > 0) {
        return res.status(405).json({
          message: 'Phone number already exists',
          status: 'phone_exists',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        username: userHandle,
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        password: hashedPassword,
        aadharpresent: false,
        favorites: [],
      })
      .returning();

    const createdUser = newUser[0];
    const { password: _, ...userSafe } = createdUser;
    const tokens = getToken(userSafe);

    res.status(200).json({
      data: {
        token: tokens,
        user: userSafe,
      },
      message: 'Signup successful',
    });
  } catch (error) {
    console.error('Error in signup:', error);
    next(error);
  }
};
