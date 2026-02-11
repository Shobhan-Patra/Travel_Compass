import {ApiError} from "./apiError.ts";

function handleDbErrors(error: any) {
    console.log(error);

    if (error.code === "23505") {
        return new ApiError(400, "Destination already exists");
    }

    if (error.code === "23503") {
        return new ApiError(400, "Invalid reference");
    }

    if (error.code === "23502") {
        return new ApiError(400, "Missing required field");
    }

    if (error.code === "23514") {
        return new ApiError(400, "Invalid Rating score, Rating must be between 1 and 10");
    }

    if (error.code === "22P02") {
        return new ApiError(400, "Invalid input format");
    }

    return new ApiError(400, "Database error");
}

export default handleDbErrors;