export interface JwtPayload {
    id: string;
    email: string;
}

export interface RegisterDTO {
    username: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}