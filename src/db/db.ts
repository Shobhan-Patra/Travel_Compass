import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email varchar(255) UNIQUE NOT NULL,
        username varchar(255) NOT NULL,
        password TEXT NOT NULL,
        refreshtoken TEXT DEFAULT NULL,
        is_native boolean NOT NULL DEFAULT false
    );
`

const destinationsTable = `
    CREATE TABLE IF NOT EXISTS destinations (
        id UUID PRIMARY KEY,
        
        name TEXT NOT NULL,
        state TEXT,
        country TEXT NOT NULL,
        
        image_url TEXT,
        description TEXT,
                                            
        UNIQUE (name, country)
    );
`

const postsTable = `
    CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY,
        
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE ,
        destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
        
        title varchar(255) NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[] DEFAULT NULL,
        visited_at DATE,
        rating SMALLINT NOT NULL CHECK ( rating BETWEEN 1 AND 10 ),
        
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
`

export async function initDB() {
    const createSchema = `
        ${usersTable}
        ${destinationsTable}
        ${postsTable}
    `;
    await pool.query(createSchema);
}

export default pool;