import {ApiError} from "../utils/apiError.ts";
import db from "../db/db.ts";
import { v4 as uuidv4 } from "uuid";
import handleDbErrors from "../utils/dbErrorHandler.ts";

class DestinationService {
    async AddNewDestination(name: string, state: string, country: string, imageUrl: string | null, description: string) {
        if (!name) throw new ApiError(400, "Destination name is required");
        if (!country) throw new ApiError(400, "Destination country is required");
        if (imageUrl?.trim() === "") imageUrl = null;

        let result;
        try {
            const destinationId = uuidv4();
            const insertDestination = `INSERT INTO destinations (id, name, state, country, image_url, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
            result = await db.query(insertDestination, [destinationId, name, state, country, imageUrl, description]);
        } catch (error) {
            throw handleDbErrors(error);
        }

        if (result.rows.length === 0) {
            throw new ApiError(400, "Failed to add destination");
        }

        return result.rows[0]
    }
}

export default new DestinationService();