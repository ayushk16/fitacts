import pool from "../app/config/dbConfig.js";
import bcrypt from "bcryptjs";
import getToken from "../functions/jwtAuth.js";
import dotenv from "dotenv";
dotenv.config();

export const loginController = async (req, res, next) => {
    const email = req.query.email;
    const password = req.query.password
    console.log(email, password)
    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
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
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while creating user';
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}