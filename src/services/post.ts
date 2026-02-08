import {ApiError} from "../utils/apiError.ts";
import { v4 as uuidv4} from "uuid";
import db from "../db/db.ts";

class PostService {
    async createPost(userId: string, title: string, content: string, visitedAt: string, tags: string[], rating: number) {
        if (!title) {
            throw new ApiError(400, "Title is required")
        }
        if (!content) {
            throw new ApiError(400, "Post content is required")
        }
        if (!visitedAt) {
            throw new ApiError(400, "Visited at date is required")
        }
        if (rating) {
            throw new ApiError(400, "Destination rating is required")
        }

        const visitedAtDate = new Date(visitedAt)
        const postId = uuidv4()

        const insertNewPost = `INSERT INTO posts (user_id, id, title, content, visitedAt, tags, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const result = await db.query(insertNewPost, [userId, postId, title, content, visitedAtDate, tags, rating]);

        if (result.rows.length === 0) {
            throw new ApiError(400, "Failed to create new post");
        }

        return {
            post: {
                id: postId,
                title: title,
                content: content,
                visitedAt: visitedAtDate,
                tags: tags,
                rating: rating
            }
        }
    }
}

export default new PostService();