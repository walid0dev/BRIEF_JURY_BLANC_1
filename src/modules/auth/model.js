import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 8,
      maxLength: 50,
      required: true,
      trim: true
    },
    email: {
      type: String,
      maxLength: 254,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 254,
      required: true
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client"
    }
  },
  { timestamps: true }
);
const userModel = model("User", userSchema);
export default userModel;
