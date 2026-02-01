import jwt, {type Secret, type SignOptions } from "jsonwebtoken";
import type {JwtPayload} from "../types/auth.ts";
import {ApiError} from "./apiError.ts";

const JWT_ACCESS_KEY_SECRET: Secret = process.env.JWT_ACCESS_KEY_SECRET!;
const JWT_ACCESS_KEY_EXPIRY: SignOptions["expiresIn"] = process.env.JWT_ACCESS_KEY_EXPIRY! as SignOptions["expiresIn"];
const JWT_REFRESH_KEY_SECRET: Secret = process.env.JWT_REFRESH_KEY_SECRET!;
const JWT_REFRESH_KEY_EXPIRY: SignOptions["expiresIn"] = process.env.JWT_REFRESH_KEY_EXPIRY! as SignOptions["expiresIn"];

export function generateAccessToken(payload: JwtPayload): string {
    try {
        return jwt.sign(payload, JWT_ACCESS_KEY_SECRET, {expiresIn: JWT_ACCESS_KEY_EXPIRY});
    } catch (error) {
        console.log("Error: ", error)
        throw new ApiError(400, "Error generating token");
    }
}

export function generateRefreshToken(payload: JwtPayload): string {
    try {
        return jwt.sign(payload, JWT_REFRESH_KEY_SECRET, {expiresIn: JWT_REFRESH_KEY_EXPIRY});
    } catch (error) {
        console.log("Error: ", error)
        throw new ApiError(400, "Error generating token");
    }
}

export function verifyAccessToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_ACCESS_KEY_SECRET) as JwtPayload;
    } catch (error) {
        console.log("Error: ", error)
        throw new ApiError(400, "Invalid token");
    }
}

export function verifyRefreshToken(token: string): JwtPayload {
    try {
        return jwt.verify(token, JWT_REFRESH_KEY_SECRET) as JwtPayload;
    } catch (error) {
        console.log("Error: ", error)
        throw new ApiError(400, "Invalid token");
    }
}
