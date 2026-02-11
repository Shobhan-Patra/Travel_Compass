import {ApiError} from "../utils/apiError.ts";
import { v4 as uuidv4} from "uuid";
import db from "../db/db.ts";
import handleDbErrors from "../utils/dbErrorHandler.ts";

class PostService {
    async createPost(userId: string, title: string, content: string, destinationId: string, visitedAt: string, tags: string[], rating: number) {
        if (!title) throw new ApiError(400, "Title is required")
        if (!content) throw new ApiError(400, "Post content is required")
        if (!destinationId) throw new ApiError(400, "Destination id is required")
        if (!visitedAt) throw new ApiError(400, "Visited at date is required")
        if (!rating) throw new ApiError(400, "Destination rating is required")

        const visitedAtDate = new Date(visitedAt)
        const postId = uuidv4()

        const insertNewPost = `INSERT INTO posts (
                   id, 
                   user_id, 
                   destination_id,
                   title, 
                   content, 
                   tags, 
                   visited_at,
                   rating
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`;

        const result = await db.query(insertNewPost,
            [postId, userId, destinationId, title, content, tags, visitedAtDate, rating]);

        if (result.rows.length === 0) {
            throw new ApiError(400, "Failed to create new post");
        }

        return result.rows[0]
    }

    async deletePost(postId: string, userId: string) {
        if (!postId || postId === "") {
            throw new ApiError(400, "Post ID is required");
        }

        const checkPostExistence = `SELECT id, user_id FROM posts WHERE id = $1`;
        const ExistingPostResult = await db.query(checkPostExistence, [postId]);

        if (ExistingPostResult.rows.length === 0) {
            throw new ApiError(404, "Post not found");
        }
        if (ExistingPostResult.rows[0].user_id !== userId) {
            throw new ApiError(401, "Unauthorized request, You are not the owner of the post");
        }

        const deletePost = `DELETE FROM posts WHERE id = $1`;
        await db.query(deletePost, [postId]);

        return;
    }

    async editPost(userId: string, postId: string, title: string, content: string, tags: string, rating: number) {
        if (!postId || postId === "") {
            throw new ApiError(400, "Post ID is required");
        }

        if (!title && !content && !tags && rating === undefined) {
            throw new ApiError(400, "Atleast one field must be provided to update");
        }

        let updateResult;
        try {
            const updatePost = `UPDATE posts SET title = $1, content = $2, tags = $3, rating = $4 WHERE id = $5 AND user_id = $6 RETURNING *`;
            updateResult = await db.query(updatePost, [title, content, tags, rating, postId, userId]);
        } catch (error) {
            throw handleDbErrors(error);
        }

        if (updateResult.rows.length === 0) {
            throw new ApiError(403, "You are not the owner of this post");
        }

        return updateResult.rows[0]
    }
}

export default new PostService();