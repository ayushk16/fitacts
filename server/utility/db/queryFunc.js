import pool from "../../app/config/dbConfig.js";

export const runQuery = async (query, queryParams) => {
    const res = await pool.query(query, queryParams);
    return res;
}