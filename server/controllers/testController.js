
import { runQuery } from "../utility/db/queryFunc.js";
import querries from "../utility/db/querries.js"

export const testquery = async (req, res, next) => {
    const userid = req.query.userid
    try {
        if (!userid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 401;
            throw (error);
        } else {
            const user = await runQuery(querries.getuser, [userid])
            console.log(user)
            if (!user) {
                const error = new Error('error in functioning');
                error.status = 'error in function';
                error.statusCode = 500;
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
                    res.status(200).json({ data: user.rows[0], message: 'user fetched successfully' });
                }
            }
        }

    } catch (error) {
        const Error = error
        Error.status = error.status || "internal server error";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}