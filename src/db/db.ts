import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    refreshtoken varchar(255) DEFAULT NULL
)`

export async function initDB() {
    await pool.query(createUsersTable);
}

export default pool;