import type { Request, Response } from 'express';
import {ApiResponse} from "../utils/apiResponse.ts";
import {ApiError} from "../utils/apiError.ts";
import AuthService from '../services/auth.ts';
import type {LoginDTO} from "../types/auth.ts";

async function registerUser(req: Request, res: Response) {
    const {username, email, password} = req.body;

    try {
        const userdata = await AuthService.register(username, email, password);
        return res.status(201).json(new ApiResponse(201, userdata, "User registered successfully"));
    } catch (error) {
        console.log("Error: ", error);
        // return res.status(400).json(new ApiError(400, "Something went wrong"));
    }
}

async function loginUser(req: Request, res: Response) {
    const {email, password}: LoginDTO = req.body;

    try {
        const userdata = await AuthService.login({email, password});
        return res.status(201).json(new ApiResponse(201, userdata, "User logged in successfully"));
    } catch (error) {
        console.log("Error: ", error);
        return res.status(400).json(new ApiError(400, "Something went wrong"));
    }
}

export {
    registerUser,
    loginUser
}