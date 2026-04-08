import { ConflictError, AppError, NotFoundError } from "../../utils/errors.js";
import userModel from "./model.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateToken } from "../../utils/jwt.js";

const toSafeUser = (user) => {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
    };
};

const getUser = async (filter, params = { safe: true }) => {
    const user = await userModel.findOne(filter).exec();
    if (!user) return null;
    return params.safe ? toSafeUser(user) : user;
};

const register = async (user) => {
    const exists = await getUser({ email: user.email });
    if (exists) throw new ConflictError("User already exists");
    const hashedPassword = await hashPassword(user.password);
    const created = await userModel.create({
        ...user,
        password: hashedPassword
    });
    if (!created)
        throw new AppError(500, "INTERNAL_ERROR", "user couldn't be created");
    return toSafeUser(created);
};

const login = async (request) => {
    const user = await getUser({ email: request.email }, { safe: false });
    if (!user) throw new NotFoundError("user not found");
    const match = await comparePassword(request.password, user.password);
    if (!match) throw new NotFoundError("invalid credentials");
    const token = generateToken({ id: user._id.toString(), name: user.name, role: user.role });
    return { token, user: toSafeUser(user) };
};

export default { register, login, getUser, toSafeUser };
