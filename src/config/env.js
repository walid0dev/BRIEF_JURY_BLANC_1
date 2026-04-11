import { config } from "dotenv";
import Joi from "joi";
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").required(),
  PORT: Joi.number().default(3e3),
  MONGO_URI: Joi.string().uri().required(),
  MONGO_DB_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default("1d")
});
function loadEnv() {
  config();
  const { error, value } = envSchema.validate(process.env, {
    abortEarly: false,
    allowUnknown: true,
    convert: true
  });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return value;
}
const env = loadEnv();
export default env