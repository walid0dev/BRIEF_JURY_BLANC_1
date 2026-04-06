import type { User } from "@/shared/interfaces/user.interfaces.ts";
import { Schema, model } from "mongoose";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      minLength: 8,
      maxLength: 50,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      maxLength: 254,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 254,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["client", "admin"],
    },
  },
  { timestamps: true },
);

const userModel = model("User", userSchema);
export default userModel;
