import jwt from "jsonwebtoken";
import type {JwtPayload} from "../types/auth.ts";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "30m";

export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
}

export function verifyToken(token: string): JwtPayload {
    if (!token) {
        throw new Error("Token is required");
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        throw new Error("Token is not valid");
    }
}
