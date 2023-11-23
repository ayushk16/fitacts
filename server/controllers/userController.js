
import { runQuery } from "../utility/db/queryFunc.js";
import querries from "../utility/db/querries.js"



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
            const user = await runQuery(querries.getuser, [userid]);
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
                    const updatedUser = await runQuery(querries.updateUserAadharPresent, [aadharpresent, userid]);
                    if (!updatedUser) {
                        const error = new Error('error updating user');
                        error.status = 'error updating user';
                        error.statusCode = 401;
                        throw (error);
                    }
                    else {
                        const aadharData = await runQuery(querries.getAadhar, [userid]);
                        if (!aadharData) {
                            const updatedAadharData = await runQuery(querries.updateAadharInfo, [aadhardata, userid]);

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
                            const updatedAadharData = await runQuery(querries.addAadhar, [userid, aadhardata])
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
            const user = await runQuery(querries.getuser, [userid])
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
                    const following = await runQuery(querries.getFollowing, [userid]);
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

export const pending = async (req, res, next) => {
    const userid = req.query.userid;
    try {
        if (!userid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400
            next(error);
        }
        else {
            const user = await runQuery(querries.getuser, [userid])
            if (!user || user.rows.length === 0) {
                const error = new Error('user not found');
                error.status = 'user not found';
                error.statusCode = 404;
                throw (error)
            }
            else {
                const pending = await runQuery(querries.getPending, [userid]);
                if (!pending) {
                    const error = new Error('error fetching pending to follow');
                    error.status = 'error fetching pending to follow'
                    error.statusCode = 500;
                    throw (error)
                }
                else {
                    res.status(200).json({ data: pending.rows, message: "pending data fetched successful" });
                }
            }
        }
    } catch (error) {
        const Error = error
        Error.status = error.status || "problem in fetching pending data";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}

export const addPendingRequest = async (req, res, next) => {
    try {
        const { followerid, followedid } = req.body;
        const state = 'pending';
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
                const user = await runQuery(querries.getuser, [followerid])
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
                        const followedUser = await runQuery(querries.getuser, [followedid])
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
                                const followData = await runQuery(querries.getFollowData, [followerid, followedid]);
                                const data = await runQuery(querries.getFollowerAndFollowingData, [followerid, followedid])

                                if (!followData || followData.rows.length === 0) {
                                    const followData2 = await runQuery(querries.addFollowData, [followerid, followedid, state]);
                                    if (!followData2) {
                                        const error = new Error('error inserting followdata');
                                        error.status = 'error inserting followdata';
                                        error.statusCode = 500;
                                        throw (error);
                                    }
                                    else {
                                        if (!data) {
                                            const error = new Error('users not fetched');
                                            error.status = 'users not fetched';
                                            error.statusCode = 500;
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
                                        error.statusCode = 500;
                                        throw (error);
                                    }
                                    else {
                                        const updatedData = await runQuery(querries.updateFollowData, [state, followerid, followedid]);
                                        res.status(200).json({ data: data.rows[0], message: "followdata updated successfully" });
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
        Error.status = error.status || "problem in inserting followdata pending state";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}

// now using for accepting requests
export const follow = async (req, res, next) => {
    try {
        const { followerid, followedid } = req.body;
        const state = 'followed';
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
                const user = await runQuery(querries.getuser, [followerid]);
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
                        const followedUser = await runQuery(querries.getuser, [followedid]);

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
                                const followData = await runQuery(querries.getFollowData, [followerid, followedid]);
                                const data = await runQuery(querries.getFollowerData, [followerid, followedid])

                                if (!followData || followData.rows.length === 0) {
                                    const followData2 = await runQuery(querries.addFollowData, [followerid, followedid, state]);
                                    if (!followData2) {
                                        const error = new Error('error inserting followdata');
                                        error.status = 'error inserting followdata';
                                        error.statusCode = 500;
                                        throw (error);
                                    }
                                    else {
                                        if (!data) {
                                            const error = new Error('users not fetched');
                                            error.status = 'users not fetched';
                                            error.statusCode = 500;
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
                                        error.statusCode = 500;
                                        throw (error);
                                    }
                                    else {
                                        const updatedData = await runQuery(querries.updateFollowData, [state, followerid, followedid]);
                                        if (!updatedData) {
                                            const error = new Error('error updating followdata');
                                            error.status = 'error updating followdata';
                                            error.statusCode = 500;
                                            throw (error);
                                        }
                                        else {
                                            res.status(200).json({ data: data.rows[0], message: "followdata updated successfully" });
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
            const followerUser = await runQuery(querries.getuser, [followerid])
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
                    const followedUser = await runQuery(querries.getuser, [followedid]);

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
                            const followData = await runQuery(querries.getFollowData, [followerid, followedid]);
                            if (!followData) {
                                const error = new Error('error fetching followdata');
                                error.status = 'error fetching followdata';
                                error.statusCode = 401;
                                throw (error);
                            }
                            else {
                                const data = await runQuery(querries.getFollowerAndFollowingData, [followerid, followedid]);
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
                                    const followData = await runQuery(querries.deleteFollowData, [followerid, followedid]);
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

export const requests = async (req, res, next) => {
    try {
        const userid = req.query.userid;
        if (!userid) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const user = await runQuery(querries.getuser, [userid]);
            if (!user) {
                const error = new Error('error fetching user');
                error.status = 'error fetching user';
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
                    const requests = await runQuery(querries.getRequests, [userid]);
                    if (!requests) {
                        const error = new Error('error fetching requests');
                        error.status = 'error fetching requests';
                        error.statusCode = 500;
                        throw (error);
                    }
                    else {
                        res.status(200).json({ data: requests.rows, message: "requests fetched successfully" });
                    }
                }
            }

        }


    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching requests";
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
            const user = await runQuery(querries.getuser, [userid]);
            if (!user || user.rows.length === 0 || user.rows[0].aadharpresent === false) {
                const error = new Error('user adhaar not found');
                error.status = 'user aadhar not found';
                error.statusCode = 404;
                throw (error);
            }
            else {
                const aadharData = await runQuery(querries.getAadhar, [userid]);
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