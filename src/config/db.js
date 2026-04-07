import env from "./env.js";
import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, { dbName: env.MONGO_DB_NAME });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
export {
  connectDB
};
