import userRepository from "./repo.js";
import { NotFoundError } from "../../utils/errors.js";
import { comparePassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";
const register = async (user) => {
  const created = userRepository.createUser(user);
  return created;
};
const login = async (request) => {
  const user = await userRepository.getUser({ email: request.email }, { safe: false });
  if (!user) throw new NotFoundError("user not found");
  const match = await comparePassword(request.password, user.password);
  if (!match) throw new NotFoundError("invalid credentials");
  const token = generateToken({ id: user._id.toString(), name: user.name, role: user.role });
  return { token, user: userRepository.toSafeUser(user) };
};
var service_default = { register, login };
export {
  service_default as default
};
