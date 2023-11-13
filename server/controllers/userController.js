
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
