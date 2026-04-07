import type { HydratedDocument, Types } from "mongoose";
export type UserRole = "client" | "admin";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = HydratedDocument<IUser>;
export type CreateUserDTO = Omit<
  IUser,
  "_id" | "createdAt" | "updatedAt" | "role"
> & { password: string };
export type UpdateUserDTO = Partial<CreateUserDTO>;
export type UserPublic = Omit<
  IUser,
  "password" | "createdAt" | "updatedAt" | "_id"
> & { id: string };

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
  iat: number;
  exp: number;
}
