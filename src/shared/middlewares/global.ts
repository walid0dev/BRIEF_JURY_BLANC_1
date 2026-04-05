import env from "@/config/env.ts";
import { AppError, ValidationError } from "@utils/errors.js";
import type { Request, Response, NextFunction, } from "express";

export const globalErrorHandler = (
  err: Error | AppError,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.error(err.message);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: err.code,
      // an abomination to include validation errors and stack trace in development or test environments
      ...(err instanceof ValidationError && { errors: err.errors }),
      ...((env.NODE_ENV === "development" || env.NODE_ENV === "test") && { stack: err.stack }),
    });
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
    ...((env.NODE_ENV === "development" || env.NODE_ENV === "test") && {
      stack: err.stack,
    }),
  });
};

