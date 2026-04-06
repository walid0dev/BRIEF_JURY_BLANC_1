import userRepository from "./repo.ts";
import { NotFoundError } from "@utils/errors.ts";
import { comparePassword } from "@utils/password.ts";
import { generateToken } from "@utils/jwt.ts";

import type {
  CreateUserDTO,
  LoginRequest,
  AuthResponse,
  UserPublic,
} from "@shared/interfaces/user.interfaces.ts";
const register = async (user: CreateUserDTO): Promise<UserPublic> => {
  const created = userRepository.createUser(user);
  return created;
};

const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const user = await userRepository.getUser({ email: request.email }, { safe: false });
  if (!user) throw new NotFoundError("user not found");
  const match = await comparePassword(request.password, user.password);
  if (!match) throw new NotFoundError("invalid credentials");
  const token = generateToken({ id: user._id.toString(), name: user.name, role: user.role });
  return { token, user: userRepository.toSafeUser(user) };
};

export default { register, login };
