import bcrypt from "bcryptjs";
import { runQuery } from "../utility/db/queryFunc.js";
import querries from "../utility/db/querries.js"


export const getUsers = async (req, res) => {
    try {
        const users = await runQuery(querries.getAllUsers);
        if (!users) {
            const error = new Error('error fetching users');
            error.status = "error fetching users"
            error.statusCode = 400;
            throw (error);
        }
        else {
            res.status(200).json({ data: users.rows, message: 'signup' })
        }


    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while fetching users';
        Error.statusCode = error.statusCode || 500;
        next(Error);

    }
}

export const creatUserController = async (req, res, next) => {
    const { firstname, lastname, email, phone, password } = req.body;
    const aadharPresent = false;
    const favorites = [];
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await runQuery(querries.createUser, [firstname, lastname, email, phone, hashedPassword, aadharPresent, favorites]);
        res.json({ data: { user: newUser.rows[0] }, message: 'signup successful' })
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while creating user';
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}
