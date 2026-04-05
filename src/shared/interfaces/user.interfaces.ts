export type UserRole = "client" | "admin";


export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: string;
    updatedAt?: string;
}

export type UserPublic = Omit<User, "password" | "updatedAt">;

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: UserPublic;
}

export interface JwtUserPayload {
    id: string;
    role: UserRole;
}
