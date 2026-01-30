import type {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/apiError.ts";
import {verifyAccessToken, verifyRefreshToken} from "../utils/jwt.ts";
import pool from "../db/db.ts";

export interface AuthRequest extends Request {
    user?: any;
}

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return next(new ApiError(404, "No token provided"));
    }

    try {
        const decodedAccessToken = verifyAccessToken(token);
        req.user = decodedAccessToken;
        console.log("Req made by:", decodedAccessToken);
        next();
    } catch (error) {
        return next(new ApiError(403, "Unauthorized, Invalid Token"));
    }
}

export default authenticateToken;