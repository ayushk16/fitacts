
import pool from "../app/config/dbConfig.js";






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

export const following = async (req, res, next) => {
    const userid = req.query.userid;
    try {
        if (!userid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const user = await pool.query("SELECT * FROM users WHERE id = $1", [userid]);
            if (!user) {
                const error = new Error('error fetching user');
                error.status = 'error fetching user';
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
                    const following = await pool.query("select followedinfo.id as id, followedinfo.firstname as firstname,followedinfo.lastname as lastname, followerinfo.id as followeruserid , followedinfo.id as followeduserid ,CONCAT(followerinfo.firstname ,' ' ,followerinfo.lastname) as followerusername , CONCAT(followedinfo.firstname ,' ' ,followedinfo.lastname) as followedusername from followdata join users  followerinfo on followdata.followerid = followerinfo.id join users followedinfo on followdata.followingid = followedinfo.id where followerid= $1", [userid]);
                    if (!following) {
                        const error = new Error('error fetching following');
                        error.status = 'error fetching following';
                        error.statusCode = 401;
                        throw (error);
                    }
                    else {
                        res.status(200).json({ data: following.rows, message: "followingdata fetched successful" });
                    }
                }
            }
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching following";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }

}

export const follow = async (req, res, next) => {
    try {
        const { followerid, followedid } = req.body;
        if (!followerid || !followedid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            if (followerid === followedid) {
                const error = new Error('follower and followed user cannot be same');
                error.status = 'follower and followed user cannot be same';
                error.statusCode = 400;
                throw (error);
            }
            else {
                const user = await pool.query("SELECT * FROM users WHERE id = $1", [followerid]);
                if (!user) {
                    const error = new Error('error fetching follower user');
                    error.status = 'error fetching follower user';
                    error.statusCode = 404;
                    throw (error);
                }
                else {
                    if (user.rows.length === 0) {
                        const error = new Error('follower user not found');
                        error.status = 'follower user not found';
                        error.statusCode = 404;
                        throw (error);
                    }
                    else {
                        const followedUser = await pool.query("SELECT * FROM users WHERE id = $1", [followedid]);
                        if (!followedUser) {
                            const error = new Error('error fetching followed user');
                            error.status = 'error fetching followed user';
                            error.statusCode = 404;
                            throw (error);
                        }
                        else {
                            if (followedUser.rows.length === 0) {
                                const error = new Error('followed user not found');
                                error.status = 'followed user not found';
                                error.statusCode = 404;
                                throw (error);
                            }
                            else {
                                const followData = await pool.query("SELECT * FROM followdata WHERE followerid = $1 AND followingid = $2", [followerid, followedid]);
                                if (!followData) {
                                    const error = new Error('error fetching followdata');
                                    error.status = 'error fetching followdata';
                                    error.statusCode = 401;
                                    throw (error);
                                }
                                else {
                                    const data = await pool.query("SELECT  followeduser.id as id, followeduser.firstname as firstname,followeduser.lastname as lastname ,followeruser.id AS followeruserid, CONCAT(followeruser.firstname ,' ' ,followeruser.lastname) AS followerusername, followeduser.id AS followeduserid, CONCAT(followeduser.firstname,' ',followeduser.lastname) AS followedusername FROM users followeruser CROSS JOIN users followeduser where followeruser.id =  $1 and followeduser.id = $2", [followerid, followedid])

                                    if (followData.rows.length === 0) {
                                        const followData = await pool.query("INSERT INTO followdata (followerid,followingid) VALUES ($1,$2) RETURNING *", [followerid, followedid]);
                                        if (!followData) {
                                            const error = new Error('error inserting followdata');
                                            error.status = 'error inserting followdata';
                                            error.statusCode = 404;
                                            throw (error);
                                        }
                                        else {
                                            if (!data) {
                                                const error = new Error('users not fetched');
                                                error.status = 'users not fetched';
                                                error.statusCode = 401;
                                                throw (error);
                                            }
                                            else {
                                                res.status(200).json({ data: data.rows[0], message: "followdata inserted successful" });
                                            }
                                        }
                                    }
                                    else {
                                        if (!data) {
                                            const error = new Error('users not fetched');
                                            error.status = 'users not fetched';
                                            error.statusCode = 401;
                                            throw (error);
                                        }
                                        else {
                                            res.status(200).json({ data: data.rows[0], message: "followdata already pressent" });
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }


    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in inserting followdata";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }

}

export const unfollow = async (req, res, next) => {
    try {
        const { followerid, followedid } = req.query;
        if (!followerid || !followedid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const followerUser = await pool.query("SELECT * FROM users WHERE id = $1", [followerid]);
            if (!followerUser) {
                const error = new Error('error fetching follower user');
                error.status = 'error fetching follower user';
                error.statusCode = 401;
                throw (error);
            }
            else {
                if (followerUser.rows.length === 0) {
                    const error = new Error('follower user not found');
                    error.status = 'follower user not found';
                    error.statusCode = 404;
                    throw (error);
                }
                else {
                    const followedUser = await pool.query("SELECT * FROM users WHERE id = $1", [followedid]);
                    if (!followedUser) {
                        const error = new Error('error fetching followed user');
                        error.status = 'error fetching followed user';
                        error.statusCode = 401;
                        throw (error);
                    }
                    else {
                        if (followedUser.rows.length === 0) {
                            const error = new Error('followed user not found');
                            error.status = 'followed user not found';
                            error.statusCode = 404;
                            throw (error);
                        }
                        else {
                            const followData = await pool.query("SELECT * FROM followdata WHERE followerid = $1 AND followingid = $2", [followerid, followedid]);
                            if (!followData) {
                                const error = new Error('error fetching followdata');
                                error.status = 'error fetching followdata';
                                error.statusCode = 401;
                                throw (error);
                            }
                            else {
                                const data = await pool.query("SELECT  followeduser.id as id, followeduser.firstname as firstname,followeduser.lastname as lastname,followeruser.id AS followeruserid, CONCAT(followeruser.firstname ,' ' ,followeruser.lastname) AS followerusername, followeduser.id AS followeduserid, CONCAT(followeduser.firstname,' ',followeduser.lastname) AS followedusername FROM users followeruser CROSS JOIN users followeduser where followeruser.id =  $1 and followeduser.id = $2", [followerid, followedid])
                                if (followData.rows.length === 0) {
                                    if (!data) {
                                        const error = new Error('users not fetched');
                                        error.status = 'users not fetched';
                                        error.statusCode = 401;
                                        throw (error);
                                    }
                                    else {
                                        if (data.rows.length === 0) {
                                            const error = new Error('users not found');
                                            error.status = 'users not found'
                                            error.statusCode = 404;
                                            throw (error);
                                        }
                                        else {
                                            res.status(200).json({ data: data.rows[0], message: "followdata already deleted" });
                                        }
                                    }
                                }
                                else {
                                    const followData = await pool.query("DELETE FROM followdata WHERE followerid = $1 AND followingid = $2 RETURNING *", [followerid, followedid]);
                                    if (!followData) {
                                        const error = new Error('error deleting followdata');
                                        error.status = 'error deleting followdata';
                                        error.statusCode = 401;
                                        throw (error);
                                    }
                                    else {
                                        if (!data) {
                                            const error = new Error('users not fetched');
                                            error.status = 'users not fetched';
                                            error.statusCode = 401;
                                            throw (error);
                                        }
                                        else {
                                            if (data.rows.length === 0) {
                                                const error = new Error('users not found');
                                                error.status = 'users not found'
                                                error.statusCode = 404;
                                                throw (error);
                                            }
                                            else {
                                                res.status(200).json({ data: data.rows[0], message: "followdata deleted successfully" });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in deleting followdata";
        Error.statusCode = error.statusCode || 500;
        next(Error);

    }

}


export const getAadhar = async (req, res, next) => {
    try {
        const userid = req.query.userid;
        if (!userid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const user = await pool.query("Select * from users where id = $1", [userid]);
            if (!user || user.rows.length === 0 || user.rows[0].aadharpresent === false) {
                const error = new Error('user adhaar not found');
                error.status = 'user aadhar not found';
                error.statusCode = 404;
                throw (error);
            }
            else {
                const aadharData = await pool.query("Select * from adhaars where userid = $1", [userid]);
                if (!aadharData || aadharData.rows.length === 0) {
                    const error = new Error('aadhar data not found');
                    error.status = 'aadhar data not found';
                    error.statusCode = 404;
                    throw (error);
                }
                else {
                    res.status(200).json({ data: aadharData.rows[0], message: "aadhar data fetched successfully" });
                }
            }
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching aadhar data";
        Error.statusCode = error.statusCode || 500;
        next(Error);

    }
}