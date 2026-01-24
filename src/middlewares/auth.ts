import type {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/apiError.ts";
import {verifyToken} from "../utils/jwt.ts";

export interface AuthRequest extends Request {
    user?: any;
}

const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return new ApiError(404, "No token provided");
    }

    try {
        const decodedToken = verifyToken(token);
        req.user = decodedToken;
        console.log("Req made by:", decodedToken);
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized, Invalid Token");
    }
}

export default authenticateToken;