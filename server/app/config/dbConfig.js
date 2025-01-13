import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	host: process.env.HOST,
	database: process.env.DB,
	port: process.env.DBPORT,
    ssl: {
        rejectUnauthorized: false, // Allows self-signed certificates
      },
});

const connectDb = async (pool) => {
	await pool.connect((err) => {
		if (err) {
			console.error('connection error', err.stack);
		} else {
			console.log('connected\ndatabase:', pool.options.database);
		}
	});
};

connectDb(pool);

export default pool;
