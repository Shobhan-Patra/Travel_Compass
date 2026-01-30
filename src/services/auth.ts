import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken} from "../utils/jwt.ts";
import type {JwtPayload, LoginDTO, RegisterDTO} from "../types/auth.ts";
import {ApiError} from "../utils/apiError.ts";
import db from "../db/db.ts";
import { v4 as uuidv4 } from "uuid";

class AuthService {
    async register({username, email, password}: RegisterDTO) {
        if (!username || !email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Check if the user already exists
        const existingUser: any = await db.query(`SELECT id FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            throw new ApiError(400, "An account with the same email already exists");
        }

        // Make an UserId, hash password, and generate tokens
        const userId: string = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        const jwtAccessToken = generateAccessToken({id: userId, email: email});
        const jwtRefreshToken = generateRefreshToken({id: userId, email: email});

        // Insert user details into DB
        const query = `
            INSERT INTO users (id, username, email, password, refreshtoken) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, username, email
        `;
        const result = await db.query(query, [userId, username, email, hashedPassword, jwtRefreshToken]);

        if (result.rows.length === 0) {
            throw new ApiError(400, "Failed to create new user");
        }

        return {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            user: result.rows[0]
        }
    }

    async login({email, password}: LoginDTO) {
        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Check if the user exists
        const existingUser = await db.query(`SELECT * FROM users WHERE email = $1`,
            [email]);
        if (existingUser.rows.length === 0) {
            throw new ApiError(404, "Invalid credentials");
        }

        // Compare password hashes
        const user = existingUser.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid password");
        }

        // Remove password field from user and then generate tokens
        const { password: _, ...userWithoutPassword } = user;
        const jwtAccessToken = generateAccessToken(userWithoutPassword);
        const jwtRefreshToken = generateRefreshToken({id: user.id, email: user.email});

        return {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            user: userWithoutPassword,
        }
    }

    async logout(token: string) {
        if (!token) {
            throw new ApiError(401, "No token provided");
        }

        const decodedToken = verifyAccessToken(token);

        await db.query("DELETE FROM users WHERE id = $1", [decodedToken.id]);

        return null;
    }

    async refreshToken(incomingRefreshToken: string) {
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is required");
        }

        const decoded = verifyRefreshToken(incomingRefreshToken);

        const userResult = await db.query(`SELECT id, username, email FROM users WHERE refreshtoken = ($1)`,
            [incomingRefreshToken]);

        if (userResult.rows.length === 0) {
            throw new ApiError(403, "Invalid refresh token (Reuse detected)");
        }
        const user = userResult.rows[0];
        const jwtAccessToken = generateAccessToken({id: user.id, email: user.email});
        const jwtRefreshToken = generateRefreshToken({id: user.id, email: user.email});

        await db.query("UPDATE users SET refreshToken = $1 WHERE id = $2", [jwtRefreshToken, user.id]);

        return {
            accessToken: jwtAccessToken,
            verifyRefreshToken: jwtRefreshToken,
            user: {id: user.id, email: user.email, username: user.username},
        }
    }
}

export default new AuthService();