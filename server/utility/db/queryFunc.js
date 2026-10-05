import pool from "../../app/config/dbConfig.js";

export const runQuery = async (query, queryParams) => {
    try {
        const res = await pool.query(query, queryParams);
        return res;
    } catch (error) {
        console.error('logger.query error:',error);
        throw new Error(error);
    }
}