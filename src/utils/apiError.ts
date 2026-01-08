export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly success: false = false;
    public readonly errors?: unknown;

    constructor(
        statusCode: number,
        message: string,
        errors?: unknown
    ) {
        super(message);

        // Required when extending Error in TypeScript
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}
