import { verifyToken } from "../../utils/jwt.js";
import { UnauthorizedError } from "../../utils/errors.js";
const authenticate = async (req, _, next) => {
  const token = req.token;
  if (!token) throw new UnauthorizedError("No token provided");
  const decoded = verifyToken(token);
  if (!decoded) return next(new UnauthorizedError("Invalid token"));
  Object.assign(req, { user: decoded });
  next();
};
const authorize = (roles) => {
  return (req, _, next) => {
    const user = req.user;
    if (!user) throw new UnauthorizedError("User not authenticated");
    if (!roles.includes(user.role))
      return next(new UnauthorizedError("User not authorized"));
    next();
  };
};
const requireToken = (req, _, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) throw new UnauthorizedError("No token provided");
  Object.assign(req, { token });
  next();
};
export {
  authenticate,
  authorize,
  requireToken
};
