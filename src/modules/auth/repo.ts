import { ConflictError, AppError } from "@/utils/errors.ts";
import userModel from "./model.ts";
import type {
  User,
  UserPublic,
  UserDocument,
} from "@/shared/interfaces/user.interfaces.ts";
import type { Model, QueryFilter } from "mongoose";
import { hashPassword } from "@utils/password.ts";
class UserRepository {
  constructor(private model: Model<User>) {
    this.model = model;
  }

  toSafeUser(user: UserDocument): UserPublic {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async getUser(
    filter: QueryFilter<User>,
    params: { safe: boolean } = { safe: true },
  ): Promise<UserPublic | UserDocument | null> {
    const user = await this.model.findOne(filter).exec();
    if (!user) return null;
    return params.safe ? this.toSafeUser(user) : user;
  }

  async createUser(user: User) {
    const exists = await this.getUser(user);
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
