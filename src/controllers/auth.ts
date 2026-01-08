import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {ApiError} from "../utils/apiError.ts";
import {ApiResponse} from "../utils/apiResponse.ts";

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return new ApiError(404, "No token provided");
    }


    next()
}

const loginUser = async (req: Request, res: Response) => {

}

export default authenticateToken;