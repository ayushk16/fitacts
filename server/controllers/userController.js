
import pool from "../app/config/dbConfig.js";

export const getUser = async (req, res) => {
    console.log('userCOntero')
    const userId = req.params.userid;
    console.log("userId", userId);
    if (!userId) {
        const error = new Error('cant find userId');
        error.status = 'user id not available';
        error.statusCode = 404;
        throw (error);
    }
    else {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        if (!user) {
            const error = new Error('fetching users');
            error.status = 'error fetching users';
            error.statusCode = 404;
            throw (error);
        }
        else {
            if (user.rows.length === 0) {
                const error = new Error('user not found');
                error.status = 'user not found';
                error.statusCode = 404;
                throw (error);
            }
            else {
                const token = getToken({ id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email });
                res.status(200).json({ data: { token: token, user: user.rows[0] }, message: "user fetch successful" });
            }
        }
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { userid, aadhardata } = req.body;
        const aadharpresent = true;
        if (!userid || !aadhardata) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const user = await pool.query("SELECT * FROM users WHERE id = $1", [userid]);
            if (!user) {
                const error = new Error('fetching users');
                error.status = 'error fetching users';
                error.statusCode = 404;
                throw (error);
            }
            else {
                if (user.rows.length === 0) {
                    const error = new Error('user not found');
                    error.status = 'user not found';
                    error.statusCode = 404;
                    throw (error);
                }

                else {
                    const updatedUser = await pool.query("UPDATE users SET aadharpresent = $1 WHERE id = $2 RETURNING *", [aadharpresent, userid]);
                    if (!updatedUser) {
                        const error = new Error('error updating user');
                        error.status = 'error updating user';
                        error.statusCode = 401;
                        throw (error);
                    }
                    else {
                        const aadharData = await pool.query("SELECT * FROM adhaars WHERE userid = $1", [userid]);
                        if (!aadharData) {
                            const updatedAadharData = await pool.query("UPDATE adhaars SET storageinfo = $1 WHERE userid = $2 RETURNING *", [aadhardata, userid]);
                            if (!updatedAadharData) {
                                const error = new Error('error updating user');
                                error.status = 'error updating user';
                                error.statusCode = 401;
                                throw (error);
                            }
                            else {
                                res.status(200).json({ data: updatedUser.rows[0], message: 'user updated successfuly' });
                            }
                        }
                        else {
                            const updatedAadharData = await pool.query("INSERT INTO adhaars (userid,storageinfo) values ($1,$2) RETURNING *", [userid, aadhardata]);
                            if (!updatedAadharData) {
                                const error = new Error('error updating user');
                                error.status = 'error updating user';
                                error.statusCode = 401;
                                throw (error);
                            }
                            else {
                                res.status(200).json({ data: updatedUser.rows[0], message: 'user updated successfuly' });
                            }
                        }
                    }
                }
            }

            res.status(200).json({ data: { userid: userid, aadhardata: aadhardata }, message: "user updated successful" });
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in updating useraadhar";
        Error.statusCode = error.statusCode || 500;
        next(Error);

    }
}