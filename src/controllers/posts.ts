import type {NextFunction, Request, Response} from "express";
import {ApiResponse} from "../utils/apiResponse.ts";
import PostService from "../services/post.ts";
import {AuthRequest} from "../middlewares/auth.ts";

async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
    const { title, content, visitedAtDateString, tags, rating } = req.body;
    const userId = req.user.id;
    try {
        const newPost = PostService.createPost(userId, title, content, visitedAtDateString, tags, rating);
        return res
            .status(200)
            .json(new ApiResponse(
                201,
                newPost,
                "New post created successfully"
            ));
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}