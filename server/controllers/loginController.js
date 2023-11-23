import bcrypt from "bcryptjs";
import getToken from "../functions/jwtAuth.js";
import dotenv from "dotenv";

import { runQuery } from "../utility/db/queryFunc.js";
import querries from "../utility/db/querries.js"


dotenv.config();

export const loginController = async (req, res, next) => {
    const email = req.query.email;
    const password = req.query.password
    try {
        if (!email || !password) {
            const error = new Error('email or password not provided');
            error.status = 'email or password not provided';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const user = await runQuery(querries.getUserByEmail, [email]);
            if (user.rows.length === 0) {
                const error = new Error('user not found');
                error.status = 'incorrect email';
                error.statusCode = 404;
                throw (error);
            }
            else {
                const isMatch = await bcrypt.compare(password, user.rows[0].password);
                if (isMatch) {
                    const token = getToken({ id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email });
                    res.status(200).json({ data: { token: token, user: user.rows[0] }, message: "login successful" });
                }
                else {
                    const error = new Error('incorrect password');
                    error.status = 'incorrect password';
                    error.statusCode = 401;
                    throw (error);
                }
            }
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while fetching user';
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}