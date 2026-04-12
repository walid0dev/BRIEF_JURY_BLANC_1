import { sendResponse } from "../../utils/response.js";
import authService from "./service.js";
const profile = async (req, res) => {
  const { id, name, role } = req.user;
  sendResponse(res, 200, { id, name, role }, "current user");
};
const register = async (req, res) => {
  const userData = req.body;
  const created = await authService.register(userData);
  sendResponse(res, 201, created, "user created successfully");
};
const login = async (req, res) => {
  const userData = req.body;
  const { token, user } = await authService.login(userData);
  sendResponse(res, 200, { user, token });
};
export default {
  login,
  profile,
  register,
};
