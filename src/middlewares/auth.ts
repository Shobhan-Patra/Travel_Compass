import type {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/apiError.ts";
import {verifyAccessToken} from "../utils/jwt.ts";

export interface AuthRequest extends Request {
    user?: any;
}

const authenticateToken = async (req: AuthRequest, _: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return next(new ApiError(401, "No token provided"));
    }

    try {
        req.user = verifyAccessToken(token);
        // console.log("Req made by:", decodedAccessToken);
        next();
    } catch (error) {
        return next(new ApiError(403, "Unauthorized, Invalid Token"));
    }
}

export default authenticateToken;