// import pool from "../app/config/dbConfig.js";

import { runQuery } from "../utility/db/queryFunc.js"
import querries from "../utility/db/querries.js";

export const checkUserExist = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const isuser = await runQuery(querries.getUserByEmail, [email]);
        // const isuser = await pool.query(`SELECT * FROM users WHERE email = ($1)`, [email]);
        if (isuser.rows.length === 0) {
            next();
        } else {
            const error = new Error('user already exist');
            error.status = 'user already exist';
            error.statusCode = 400;
            throw error;
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while checking user';
        Error.statusCode = error.statusCode || 500;
        next(Error)
    }
}

export const checkPhoneExist = async (req, res, next) => {
    const { phone } = req.body;
    try {
        const isuser = await runQuery(querries.getUserByPhone, [phone]);
        // const isuser = await pool.query(`SELECT * FROM users WHERE phone = ($1)`, [phone]);
        if (isuser.rows.length === 0) {
            next();
        } else {
            const error = new Error('phone already exist');
            error.status = 'phone already exist';
            error.statusCode = 405;
            throw error;
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while checking phone';
        Error.statusCode = error.statusCode || 500;
        next(Error)
    }
}