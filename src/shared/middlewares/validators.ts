import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidationError } from "@utils/errors.js";
import { type ObjectSchema } from "joi";
import catchAsync from "@utils/catchAsync.js";

export const validateBody = (schema: ObjectSchema): RequestHandler =>
  catchAsync(async (req: Request, _: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body || {}, { abortEarly: false });
    if (error) {
      throw new ValidationError("Invalid request body", error);
    }
    // reassigning req.body to the validated value to ensure it has the correct types and any transformations applied by Joi
    Object.assign(req, { body: value });
    next();
  });

export const validateQuery = (schema: ObjectSchema): RequestHandler =>
  catchAsync(async (req: Request, _: Response, next: NextFunction) => {
    
    const { error, value } = schema.validate(req.query || {}, { abortEarly: false });
    if (error) {
      throw new ValidationError("Invalid query parameters", error);
    }
    Object.assign(req, { query: value });
    next();
  });

export const validateParams = (schema: ObjectSchema): RequestHandler =>
  catchAsync(async (req: Request, _: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params || {}, { abortEarly: false });
    if (error) {
      throw new ValidationError("Invalid URL parameters", error);
    }
    Object.assign(req, { params: value });
    next();
  });
