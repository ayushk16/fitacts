import bcrypt from 'bcryptjs';
import { eq, or, ilike } from 'drizzle-orm';
import { db } from '../app/config/dbConfig.js';
import { users } from '../db/schema.js';
import { getToken, verifyRefreshToken } from '../functions/jwtAuth.js';
import { decryptPayload } from '../utility/crypto.js';

export const loginController = async (req, res, next) => {
  try {
    // Check if payload is in body (POST) or query (GET)
    const rawPayload = req.method === 'POST' ? req.body : req.query;
    const decrypted = decryptPayload(rawPayload);

    const identifier = decrypted.email || decrypted.username || req.query.email;
    const password = decrypted.password || req.query.password;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Email/username and password are required',
        status: 'missing_credentials',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Query user by email OR username with Drizzle ORM
    const userRecords = await db
      .select()
      .from(users)
      .where(or(eq(users.email, cleanIdentifier), ilike(users.username, cleanIdentifier)))
      .limit(1);

    if (userRecords.length === 0) {
      return res.status(404).json({
        message: 'User not found',
        status: 'user_not_found',
      });
    }

    const user = userRecords[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Incorrect password',
        status: 'incorrect_password',
      });
    }

    const { password: _, ...userSafe } = user;
    const token = getToken(userSafe);

    return res.status(200).json({
      data: {
        token,
        user: userSafe,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error during login:', error);
    next(error);
  }
};

export const refreshTokenController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        message: 'Refresh token is required',
        status: 'missing_refresh_token',
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({
        message: 'Invalid or expired refresh token',
        status: 'invalid_refresh_token',
      });
    }

    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id))
      .limit(1);

    if (userRecords.length === 0) {
      return res.status(404).json({
        message: 'User no longer exists',
        status: 'user_not_found',
      });
    }

    const { password: _, ...userSafe } = userRecords[0];
    const newTokens = getToken(userSafe);

    return res.status(200).json({
      data: {
        token: newTokens,
        user: userSafe,
      },
      message: 'Token refreshed successfully',
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    next(error);
  }
};