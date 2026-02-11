import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt.ts";
import type {LoginDTO, RegisterDTO} from "../types/auth.ts";
import {ApiError} from "../utils/apiError.ts";
import db from "../db/db.ts";
import { v4 as uuidv4 } from "uuid";
import handleDbErrors from "../utils/dbErrorHandler.ts";

class AuthService {
    async register({username, email, password}: RegisterDTO) {
        if (!username || !email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        // Make an UserId, hash password, and generate tokens
        const userId: string = uuidv4();
        const hashedPassword = await bcrypt.hash(password, 12);

        const jwtAccessToken = generateAccessToken({id: userId, email: email});
        const jwtRefreshToken = generateRefreshToken({id: userId, email: email});

        // Insert user details into DB
        let result;
        try {
            const query = `
            INSERT INTO users (id, username, email, password, refreshtoken) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, username, email
        `;
            result = await db.query(query, [userId, username, email, hashedPassword, jwtRefreshToken]);
        } catch (error) {
            throw handleDbErrors(error);
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
        const existingUser = await db.query(`SELECT id, username, email, password, is_native FROM users WHERE email = $1`,
            [email]);
        if (existingUser.rows.length === 0) {
            throw new ApiError(401, "Invalid credentials");
        }

        // Compare password hashes
        const user = existingUser.rows[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid credentials");
        }

        // Remove password field from user and then generate tokens
        const { password: _, ...userWithoutPassword } = user;
        const jwtAccessToken = generateAccessToken({id: user.id, email: user.email});
        const jwtRefreshToken = generateRefreshToken({id: user.id, email: user.email});

        await db.query(`UPDATE users SET refreshtoken = $1 WHERE id = $2`,
            [jwtRefreshToken, user.id])

        return {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            user: userWithoutPassword,
        }
    }

    async logout(userId: string) {
        if (!userId) {
            throw new ApiError(400, "User ID is required");
        }

        try {
            await db.query("UPDATE users SET refreshtoken = NULL WHERE id = $1",
                [userId]);
        } catch (error) {
            throw handleDbErrors(error);
        }

        return null;
    }

    async refreshToken(incomingRefreshToken: string) {
        if (!incomingRefreshToken) {
            throw new ApiError(401, "Refresh token is required");
        }

        try {
            verifyRefreshToken(incomingRefreshToken);
        } catch (error) {
            throw new ApiError(401, "Invalid refresh token");
        }

        const userResult = await db.query(`SELECT id, username, email FROM users WHERE refreshtoken = ($1)`,
            [incomingRefreshToken]);

        if (userResult.rows.length === 0) {
            throw new ApiError(403, "Invalid refresh token (Reuse detected)");
        }

        const user = userResult.rows[0];
        const jwtAccessToken = generateAccessToken({id: user.id, email: user.email});
        const jwtRefreshToken = generateRefreshToken({id: user.id, email: user.email});

        await db.query("UPDATE users SET refreshtoken = $1 WHERE id = $2",
            [jwtRefreshToken, user.id]);

        return {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            user: {id: user.id, email: user.email, username: user.username},
        }
    }
}

export default new AuthService();