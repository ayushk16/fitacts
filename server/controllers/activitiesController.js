import { runQuery } from "../utility/db/queryFunc.js";
import querries from "../utility/db/querries.js"


// import pool from "../app/config/dbConfig.js";
import dotenv from "dotenv";
dotenv.config();


export const getAllActivities = async (req, res, next) => {
    try {
        const activities = await runQuery(querries.getAllActivities);
        // const activities = await pool.query("select * from activities");
        if (!activities) {
            const error = new Error('fetching activities');
            error.status = 'error fetching activities';
            error.statusCode = 401;
            throw (error);
        }
        else {
            res.status(200).json({ data: activities.rows, message: 'activities fetched successfuly' });
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching activities";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}

export const getActivity = async (req, res, next) => {
    try {
        const activityId = req.query.activityId;
        if (!activityId) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const activity = await runQuery(querries.getActivity, [activityId]);
            // const activity = await pool.query("select * from activities where id = $1", [activityId]);
            if (!activity) {
                const error = new Error('activity not found')
                error.status = 'wrong activity id';
                error.statusCode = 404;
                throw (error);
            }
            else {
                res.status(200).json({ data: activity.rows[0], message: "activity fetched successfully" })
            }
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while fetching activity data';
        Error.statusCode = error.statusCode || 500;
    }
}

export const updateFavorite = async (req, res, next) => {
    try {
        const { userId, activityId, value } = req.body;
        // console.log(userId, activityId, value)
        if (userId === undefined || activityId === undefined || value === undefined) {
            const error = new Error('missing parameters');
            error.status = 'missing parameters';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const user = await runQuery(querries.getuser, [userId]);
            // const user = await pool.query("select * from users where id = $1", [userId]);
            if (!user) {
                const error = new Error('user not found');
                error.status = 'wrong user id';
                error.statusCode = 404;
                throw (error);
            }
            else {
                const favorites = user.rows[0].favorites;
                if (value === 'true') {
                    if (favorites.includes(activityId)) {
                        res.status(200).json({ data: user.rows[0], message: 'favorites updated successfully' });
                    }
                    else {
                        favorites.push(activityId);
                        const updatedUser = await runQuery(querries.updateUserFavorites, [favorites, userId])
                        // const updatedUser = await pool.query("update users set favorites = $1 where id = $2", [favorites, userId]);
                        if (!updatedUser) {
                            const error = new Error('error while updating favorites');
                            error.status = 'error while updating favorites';
                            error.statusCode = 500;
                            throw (error);
                        }
                        else {
                            const userdata = await runQuery(querries.getuser, [userId]);
                            // const userdata = await pool.query("select * from users where id = $1", [userId]);
                            res.status(200).json({ data: userdata.rows[0], message: 'favorites updated successfully' });
                        }
                    }
                }
                else if (value === 'false') {
                    if (favorites.includes(activityId)) {
                        const index = favorites.indexOf(activityId);
                        favorites.splice(index, 1);
                        const updatedUser = await runQuery(querries.updateUserFavorites, [favorites, userId]);
                        // const updatedUser = await pool.query("update users set favorites = $1 where id = $2", [favorites, userId]);
                        if (!updatedUser) {
                            const error = new Error('error while updating favorites');
                            error.status = 'error while updating favorites';
                            error.statusCode = 500;
                            throw (error);
                        }
                        else {
                            const userdata = await runQuery(querries.getuser, [userId]);
                            // const userdata = await pool.query("select * from users where id = $1", [userId]);

                            res.status(200).json({ data: userdata.rows[0], message: 'favorites updated successfully' });
                        }
                    }
                    else {
                        res.status(200).json({ data: user.rows[0], message: 'favorites updated successfully' });
                    }
                }
                else {
                    const error = new Error('wrong value');
                    error.status = 'wrong value';
                    error.statusCode = 400;
                    throw (error);
                }

            }
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || 'error while updating favorites';
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}
