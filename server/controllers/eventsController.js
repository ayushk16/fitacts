import pool from "../app/config/dbConfig.js";
import bcrypt from "bcryptjs";
import getToken from "../functions/jwtAuth.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import e from "express";
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
            const events = await pool.query("SELECT *, events.id as eventid, events.name as eventname, activities.name as activityname FROM events JOIN activities ON activities.id = events.activityid WHERE userid =   $1", [userId]);
            if (!events) {
                const error = new Error('fetching events');
                error.status = 'error fetching events';
                error.statusCode = 401;
                throw (error);
            }
            else {
                console.log(events.rows)
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
            const newEvent = await pool.query("INSERT INTO events (name,userid,activityid,distance,duration,showintimeline) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *", [name, userid, activityid, distance, duration, showintimeline]);
            if (!newEvent) {
                const error = new Error('error creating event');
                error.status = 'error creating event';
                error.statusCode = 401;
                throw (error);
            }
            else {
                const event = await pool.query("SELECT *, events.id as eventid, events.name as eventname, activities.name as activityname FROM events JOIN activities ON activities.id = events.activityid WHERE events.id = $1", [newEvent.rows[0].id]);
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
    console.log("update event called")
    try {
        const { userid, eventid, showintimeline } = req.body;
        if (!userid || !eventid || showintimeline === undefined) {
            const error = new Error('missing data');
            error.status = 'missing data';
            error.statusCode = 400;
            throw (error);
        }
        else {
            const event = await pool.query("UPDATE events SET showintimeline = $1  WHERE id = $2 AND userid = $3 RETURNING *", [showintimeline, eventid, userid]);
            if (!event) {
                const error = new Error('error updating event');
                error.status = 'error updating event';
                error.statusCode = 401;
                throw (error);
            }
            else {
                console.log(event);
                const eventToReturn = await pool.query("SELECT *, events.id as eventid , events.name as eventname, activities.name as activityname FROM events JOIN activities ON activities.id = events.activityid WHERE events.id = $1", [event.rows[0].id]);
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
            const events = await pool.query("SELECT *, events.id AS eventid , events.name AS eventname, activities.name AS activityname FROM events JOIN activities ON activities.id = events.activityid WHERE userid = $1 AND activityid = $2 ORDER BY distance DESC LIMIT 5;", [userId, activityId])
            res.status(200).json({ data: events.rows, message: 'top events fetched successfuly' });
        }
    } catch (error) {
        const Error = error;
        Error.status = error.status || "problem in fetching top events";
        Error.statusCode = error.statusCode || 500;
        next(Error);
    }

}