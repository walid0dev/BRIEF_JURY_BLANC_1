import userRepository from "./repo.ts";
import { NotFoundError } from "@utils/errors.ts";
import { comparePassword } from "@utils/password.ts";
import { generateToken } from "@utils/jwt.ts";

import type {
  User,
  LoginRequest,
  AuthResponse,
  UserDocument,
} from "@shared/interfaces/user.interfaces.ts";
const register = async (user: User) => {
  const created = userRepository.createUser(user);
  return created;
};

const login = async (request: LoginRequest): Promise<AuthResponse> => {
  let user = await userRepository.getUser({ request }, { safe: false });
  if (!user) throw new NotFoundError("user not found");
  user = user as UserDocument;
  const match = await comparePassword(request.password, user.password);
  if (!match) throw new NotFoundError("invalid credentials");
  const token = generateToken({ id: user._id, name: user.name , role: user.role });
  return { token , user:userRepository.toSafeUser(user) };
};

export default { register, login };
