import { config } from "dotenv";
import Joi from "joi";

// here we load the .env file and validate it using Joi

interface Env {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    MONGO_URI: string;
    MONGO_DB_NAME: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
}

const envSchema = Joi.object<Env>({
    NODE_ENV: Joi.string().valid("development", "production", "test").required(),
    PORT: Joi.number().default(3000),
    MONGO_URI: Joi.string().uri().required(),
    MONGO_DB_NAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default("1d"),
});
function loadEnv() {
    config();

    const { error, value } = envSchema.validate(process.env, {
        abortEarly: false,
        allowUnknown: true,
        convert: true,
    });

    if (error) {
        throw new Error(`Config validation error: ${error.message}`);
    }
    
    return value as Env;
}

const env = loadEnv();

export default env;