import { ConflictError, AppError } from "@/utils/errors.ts";
import userModel from "./model.ts";
import type {
  IUser, IUserDocument,
  CreateUserDTO,
  UserPublic,
} from "@/shared/interfaces/user.interfaces.ts";
import type { Model, QueryFilter } from "mongoose";
import { hashPassword } from "@utils/password.ts";
class UserRepository {
  constructor(private model: Model<IUser>) {}

  toSafeUser(user: IUserDocument): UserPublic {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async getUser(
    filter: QueryFilter<IUser>,
  ): Promise<UserPublic | null>;
  async getUser(
    filter: QueryFilter<IUser>,
    params: { safe: true },
  ): Promise<UserPublic | null>;
  async getUser(
    filter: QueryFilter<IUser>,
    params: { safe: false },
  ): Promise<IUserDocument | null>;
  async getUser(
    filter: QueryFilter<IUser>,
    params: { safe: boolean } = { safe: true },
  ): Promise<UserPublic | IUserDocument | null> {
    const user = await this.model.findOne(filter).exec();
    if (!user) return null;
    return params.safe ? this.toSafeUser(user) : user;
  }

  async createUser(user: CreateUserDTO): Promise<UserPublic> {
    const exists = await this.getUser({ email: user.email });
    if (exists) throw new ConflictError("User already exists");
    const hashedPassword = await hashPassword(user.password);
    const created = await this.model.create({
      ...user,
      password: hashedPassword,
    });
    if (!created)
      throw new AppError(500, "INTERNAL_ERROR", "user couldn't be created");
    return this.toSafeUser(created);
  }
}

const userRepository = new UserRepository(userModel);

export default userRepository;
