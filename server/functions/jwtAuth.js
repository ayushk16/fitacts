import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fitacts_default_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_SECRET_EXPIRESIN || '1h';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fitacts_default_jwt_refresh_secret';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRESIN || '7d';

export const getToken = ({ id, username, email, firstname, lastname }) => {
  const payload = { id, username, email, firstname, lastname };
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

export default getToken;