import {ApiResponse} from "../utils/apiResponse.ts";
import type { NextFunction, Request, Response } from "express";
import DestinationService from "../services/destination.ts";
import CloudinaryService from "../services/cloudinary.ts";

const cloudinary = new CloudinaryService();

async function addNewDestination(req: Request, res: Response, next: NextFunction) {
    const { name, state, country, imageUrl, description } = req.body || {};
    try {
        const newDestination = await DestinationService.AddNewDestination(name, state, country, imageUrl, description);
        return res
            .status(201)
            .json(new ApiResponse(
                201,
                        newDestination,
                "New destination added successfully"
            ));
    } catch (error) {
        console.log(error);
        next(error);
    }
}

async function getUploadURL(_: Request, res: Response, next: NextFunction) {
    try {
        const data = await cloudinary.getSignedUploadURL();

        return res
            .status(200)
            .json(new ApiResponse(
                201,
                data,
                "Signed upload URL generated successfully"
            ));
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    addNewDestination,
    getUploadURL
}