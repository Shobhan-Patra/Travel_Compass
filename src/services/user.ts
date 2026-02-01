import {ApiError} from "../utils/apiError.ts";
import db from "../db/db.ts";

class UserService {
    async getUserProfile(userId: string) {
        if (!userId) {
            throw new ApiError(400, "Invalid credentials");
        }

        const selectUser = `SELECT id, username, email FROM users WHERE id = $1`;
        const userData = await db.query(selectUser, [userId]);

        if (userData.rows.length === 0) {
            throw new ApiError(404, "User not found");
        }

        return userData.rows[0];
    }
}

export default new UserService();