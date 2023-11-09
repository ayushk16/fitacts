import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authCheck = async (req, res, next) => {
    try {
        const token = req.header["authorisation"];
        if (!token) {
            const error = new Error('cant find token');
            error.status = "token not passed";
            error.statusCode = 403;
            throw (error);
        }
        else {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                if (err) {
                    const error = new Error('invalid token');
                    error.status = "user not authenticated";
                    error.statusCode = 403;
                    throw (error);
                }
                else {
                    next();
                }
            })
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || "error in authentication";
        Error.statusCode = error.statusCode || 403;
        next(Error);
    }
}
