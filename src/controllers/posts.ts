import type {NextFunction, Response} from "express";
import {ApiResponse} from "../utils/apiResponse.ts";
import PostService from "../services/post.ts";
import type {AuthRequest} from "../middlewares/auth.ts";

async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
    const { title, destinationId, content, visitedAtDateString, tags, rating } = req.body || {};
    const userId = req.user.id;
    try {
        const newPost = await PostService.createPost(userId, title, content, destinationId, visitedAtDateString, tags, rating);
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

async function deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        await PostService.deletePost(postId, userId);
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                postId,
                "Post deleted successfully"
            ));
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

async function updatePost(req: AuthRequest, res: Response, next: NextFunction) {
    const { title, content, tags, rating } = req.body || {};
    const { postId } = req.params;
    const userId = req.user.id;
    try {
        const updatedPost = await PostService.editPost(userId, postId, title, content, tags, rating);
        return res
            .status(200)
            .json(new ApiResponse(
                200,
                updatedPost,
                "Post Updated successfully"
            ));
    } catch (error) {
        console.log("Error: ", error);
        next(error);
    }
}

export {
    createPost,
    deletePost,
    updatePost,
}