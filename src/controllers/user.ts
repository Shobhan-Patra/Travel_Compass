import type {NextFunction, Request, Response} from 'express';
import {ApiResponse} from "../utils/apiResponse.ts";
import AuthService from '../services/auth.ts';
import type {LoginDTO} from "../types/auth.ts";

async function registerUser(req: Request, res: Response, next: NextFunction) {
    const {username, email, password} = req.body;

    try {
        const userdata = await AuthService.register(username, email, password);
        return res.status(201).json(new ApiResponse(201, userdata, "User registered successfully"));
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
    const {email, password}: LoginDTO = req.body;

    try {
        const userdata = await AuthService.login({email, password});
        return res.status(201).json(new ApiResponse(201, userdata, "User logged in successfully"));
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

export {
    registerUser,
    loginUser
}