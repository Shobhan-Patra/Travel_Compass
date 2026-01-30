import jwt, {type Secret, type SignOptions } from "jsonwebtoken";
import type {JwtPayload} from "../types/auth.ts";

const JWT_ACCESS_KEY_SECRET: Secret = process.env.JWT_ACCESS_KEY_SECRET!;
const JWT_ACCESS_KEY_EXPIRY: SignOptions["expiresIn"] = process.env.JWT_ACCESS_KEY_EXPIRY! as SignOptions["expiresIn"];
const JWT_REFRESH_KEY_SECRET: Secret = process.env.JWT_REFRESH_KEY_SECRET!;
const JWT_REFRESH_KEY_EXPIRY: SignOptions["expiresIn"] = process.env.JWT_REFRESH_KEY_EXPIRY! as SignOptions["expiresIn"];

export function generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_ACCESS_KEY_SECRET, {expiresIn: JWT_ACCESS_KEY_EXPIRY});
}

export function generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_REFRESH_KEY_SECRET, {expiresIn: JWT_REFRESH_KEY_EXPIRY});
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_ACCESS_KEY_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_REFRESH_KEY_SECRET) as JwtPayload;
}
