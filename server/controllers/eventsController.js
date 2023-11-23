import { runQuery } from "../utility/db/queryFunc.js";
import querries from "../utility/db/querries.js"


import dotenv from "dotenv";
dotenv.config();


export const getAllEvents = async (req, res, next) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            const error = new Error('cant find userId');
            error.status = 'user id not available';
            error.statusCode = 404;
            throw (error);
        }
        else {
            const events = await runQuery(querries.getUsersEvents, [userId]);
            if (!events) {
                const error = new Error('fetching events');
                error.status = 'error fetching events';
                error.statusCode = 401;
                throw (error);
            }
            else {
                res.status(200).json({ data: events.rows, message: 'events fetched successfuly' });
            }
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching events";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}

export const createEvent = async (req, res, next) => {
    try {
        const { name, userid, activityid, distance, duration } = req.body;
        const showintimeline = false;
        if (!name || !userid || !activityid || !distance || !duration) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const newEvent = await runQuery(querries.createEvent, [name, userid, activityid, distance, duration, showintimeline]);
            if (!newEvent) {
                const error = new Error('error creating event');
                error.status = 'error creating event';
                error.statusCode = 401;
                throw (error);
            }
            else {

                const event = await runQuery(querries.getEventById, [newEvent.rows[0].id]);

                res.status(200).json({ data: event.rows[0], message: 'event created successfuly' });
            }
        }


    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in creating event";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}

export const updateEvent = async (req, res, next) => {
    try {
        const { userid, eventid, showintimeline } = req.body;
        if (!userid || !eventid || showintimeline === undefined) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const event = await runQuery(querries.updateEvent, [showintimeline, eventid, userid]);

            if (!event) {
                const error = new Error('error updating event');
                error.status = 'error updating event';
                error.statusCode = 401;
                throw (error);
            }
            else {
                const eventToReturn = await runQuery(querries.getEventById, [event.rows[0].id]);

                if (eventToReturn.rows.length === 0) {
                    const error = new Error('event not found');
                    error.status = 'event not found';
                    error.statusCode = 404;
                    throw (error);
                }
                else {
                    res.status(200).json({ data: eventToReturn.rows[0], message: 'event updated successfuly' });
                }
            }
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in updating event";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}


export const getTopEvents = async (req, res, next) => {
    try {
        const userId = req.query.userId;
        const activityId = req.query.activityId;
        if (!userId) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        } else {
            const events = await runQuery(querries.getTopEvents, [userId, activityId])

            res.status(200).json({ data: events.rows, message: 'top events fetched successfuly' });
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching top events";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }

}

export const getEventsBreakdown = async (req, res, next) => {
    try {
        const userId = req.query.id;
        const limit = req.query.limit;
        const offset = req.query.offset;
        if (!userId || !limit) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        } else {
            const events = await runQuery(querries.getEventsInParts, [userId, limit, offset]);
            if (!events) {
                const error = new Error('error fetching events breakdown');
                error.status = 'error fetching events breakdown';
                error.statusCode = 401;
                throw (error);
            }
            else {
                const allevents = await runQuery(querries.getAllTimelineEvents, [userId]);
                if (!allevents) {
                    const error = new Error('error fetching events breakdown');
                    error.status = 'error fetching events breakdown';
                    error.statusCode = 401;
                    throw (error);
                }
                else {
                    const breakdown = {
                        events: events.rows,
                        length: allevents.rows.length
                    }
                    res.status(200).json({ data: breakdown, message: 'events breakdown fetched successfuly' });
                }
            }
        }

    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching events breakdown";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }
}