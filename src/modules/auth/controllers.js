import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/response.js";
import authService from "./service.js";
import { log } from "node:console";
const profile = catchAsync(async (req, res) => {
  const { id, name, role } = req.user;
  sendResponse(res, 200, { id, name, role }, "current user");
});
const register = catchAsync(async (req, res) => {
  const userData = req.body;
  log("Received registration data:", userData);
  const created = await authService.register(userData);
  sendResponse(res, 201, created, "user created successfully");
});
const login = catchAsync(async (req, res) => {
  const userData = req.body;
  const { token, user } = await authService.login(userData);
  sendResponse(res, 200, { user, token });
});
export default {
  login,
  profile,
  register,
};
