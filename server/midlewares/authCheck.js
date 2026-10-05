import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authCheck = async (req, res, next) => {
  try {
    let token = req.header('x-access-token');
    const authHeader = req.header('authorization');

    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'No authorization token provided',
        status: 'token_missing',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
          status: 'token_invalid',
        });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    const err = error;
    err.status = err.status || 'error in authentication';
    err.statusCode = error.statusCode || 403;
    next(err);
  }
};
