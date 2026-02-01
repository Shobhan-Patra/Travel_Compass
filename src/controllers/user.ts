import type {NextFunction, Request, Response} from 'express';
import {ApiResponse} from "../utils/apiResponse.ts";
import AuthService from '../services/auth.ts';
import UserService from '../services/user.ts';
import type {LoginDTO} from "../types/auth.ts";
import type {AuthRequest} from "../middlewares/auth.ts";

async function registerUser(req: Request, res: Response, next: NextFunction) {
    const {username, email, password} = req.body;

    try {
        const userdata = await AuthService.register({username, email, password});
        return res
            .status(201)
            .json(new ApiResponse(
                201,
                userdata,
                "User registered successfully")
            );
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
    const {email, password}: LoginDTO = req.body;

    try {
        const userdata = await AuthService.login({email, password});
        return res
            .status(200)
            .json(new ApiResponse(
                201,
                userdata,
                "User logged in successfully")
            );
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

async function refreshToken(req: Request, res: Response, next: NextFunction) {
    const {token} = req.body;

    try {
        const userData = await AuthService.refreshToken(token);
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                userData,
                "User token refresh successfully")
            );
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

async function logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        await AuthService.logout(req.user.id);
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                null,
                "User logged out successfully")
            );
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

async function getUserProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userData = await UserService.getUserProfile(req.user.id);
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                userData,
                "User profile fetched successfully")
            );
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

export {
    registerUser,
    loginUser,
    refreshToken,
    logout,
    getUserProfile
}