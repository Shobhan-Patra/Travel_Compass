export interface JwtPayload {
    userId: string;
    email: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}