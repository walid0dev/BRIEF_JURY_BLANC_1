import type { Document, SchemaTimestampsConfig } from "mongoose";
export type UserRole = "client" | "admin";

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export type UserDocument = User & Document & SchemaTimestampsConfig;
export interface UserPublic {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
  name: string;
  role: UserRole;
}
