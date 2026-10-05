import pg from 'pg';
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema.js';

dotenv.config();

const { Pool } = pg;

const isLocal = !process.env.HOST || process.env.HOST === 'localhost' || process.env.HOST === '127.0.0.1';

const poolConfig = {
  user: process.env.DBUSER || 'ayush.',
  password: process.env.DBPASSWORD || '',
  host: process.env.HOST || 'localhost',
  database: process.env.DB || 'fit_acts',
  port: parseInt(process.env.DBPORT || '5432', 10),
};

if (!isLocal && process.env.DB_SSL !== 'false') {
  poolConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

export const db = drizzle(pool, { schema });
export default pool;
