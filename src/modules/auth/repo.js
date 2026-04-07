import { ConflictError, AppError } from "../../utils/errors.js";
import userModel from "./model.js";
import { hashPassword } from "../../utils/password.js";
class UserRepository {
  constructor(model) {
    this.model = model;
  }
  model;
  toSafeUser(user) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
  async getUser(filter, params = { safe: true }) {
    const user = await this.model.findOne(filter).exec();
    if (!user) return null;
    return params.safe ? this.toSafeUser(user) : user;
  }
  async createUser(user) {
    const exists = await this.getUser({ email: user.email });
    if (exists) throw new ConflictError("User already exists");
    const hashedPassword = await hashPassword(user.password);
    const created = await this.model.create({
      ...user,
      password: hashedPassword
    });
    if (!created)
      throw new AppError(500, "INTERNAL_ERROR", "user couldn't be created");
    return this.toSafeUser(created);
  }
}
const userRepository = new UserRepository(userModel);
var repo_default = userRepository;
export {
  repo_default as default
};
