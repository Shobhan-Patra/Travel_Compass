import pool from "../db/db.ts";
import bcrypt from "bcrypt";
import {generateToken} from "../utils/jwt.ts";
import type {LoginDTO} from "../types/auth.ts";

class AuthService {
    async register(username: string, email: string, password: string) {
        if (!username || !email || !password) {
            throw new Error("Email and password are required");
        }

        const existingUser: any = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
        console.log(existingUser);

        if (existingUser.rows.length > 0) {
            throw new Error("An account with the same email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const query = `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, email
        `;
        const result = await pool.query(query, [username, email, hashedPassword]);

        if (result.rows.length === 0) {
            throw new Error("Failed to create new user");
        }

        const jwtToken = generateToken(result.rows[0]);

        return {
            token: jwtToken,
            user: result.rows[0]
        }
    }

    async login({email, password}: LoginDTO) {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length === 0) {
            throw new Error("Account not found");
        }

        const user = existingUser.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error("Invalid password");
        }

        const { password: _, ...userWithoutPassword } = user;
        const jwtToken = generateToken(userWithoutPassword);

        return {
            token: jwtToken,
            user: userWithoutPassword,
        }
    }
}

export default new AuthService();