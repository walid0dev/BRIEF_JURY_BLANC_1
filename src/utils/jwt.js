import env from "../config/env.js";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors.js";
const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new UnauthorizedError("Invalid credentials");
  }
};
const generateToken = (payload) => {
  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
  return token;
};
export {
  generateToken,
  verifyToken
};
