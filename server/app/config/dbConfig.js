import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    host: process.env.HOST,
    database: process.env.DB,
    port: process.env.DBPORT
})

export default pool;