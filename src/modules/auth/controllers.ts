import catchAsync from "@/utils/catchAsync.ts";
import { sendResponse } from "@/utils/response.ts";
import type { RequestHandler } from "express";
import type {
  CreateUserDTO,
  LoginRequest,
} from "@shared/interfaces/user.interfaces.ts";
import authService from "./service.ts";
import { log } from "node:console";

export const profile: RequestHandler = catchAsync(async (req, res) => {
  const { id, name, role } = req.user!;
  sendResponse(res, 200, { id, name, role }, "current user");
});

export const register: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body as CreateUserDTO;
  log("Received registration data:", userData);
  const created = await authService.register(userData);
  sendResponse(res, 201, created, "user created successfully");
});

export const login: RequestHandler = catchAsync(async (req, res) => {
  const userData = req.body as LoginRequest;
  const { token, user } = await authService.login(userData);
  sendResponse(res, 200, { user, token });
});

export default { register, login, profile };
