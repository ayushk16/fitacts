import bcrypt from "bcryptjs";
import pool from "../app/config/dbConfig.js";

export const getUsers = async (req, res) => {
    const users = await pool.query("SELECT * FROM users");
    res.json({ data: users.rows, message: 'signup' })
}

export const creatUserController = async (req, res, next) => {
    const { firstname, lastname, email, phone, password } = req.body;
    const aadharPresent = false;
    const favorites = [];
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query("INSERT INTO users (firstname, lastname, email, phone, password , aadharpresent, favorites) VALUES ($1, $2, $3 ,$4, $5, $6 ,$7) RETURNING *", [firstname, lastname, email, phone, hashedPassword, aadharPresent, favorites]);
        res.json({ data: { user: newUser.rows[0] }, message: 'signup successful' })
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while creating user';
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}
