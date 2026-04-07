import { ValidationError } from "../../utils/errors.js";
import catchAsync from "../../utils/catchAsync.js";
const validateBody = (schema) => catchAsync(async (req, _, next) => {
  const { error, value } = schema.validate(req.body || {}, { abortEarly: false });
  if (error) {
    throw new ValidationError("Invalid request body", error);
  }
  Object.assign(req, { body: value });
  next();
});
const validateQuery = (schema) => catchAsync(async (req, _, next) => {
  const { error, value } = schema.validate(req.query || {}, { abortEarly: false });
  if (error) {
    throw new ValidationError("Invalid query parameters", error);
  }
  Object.assign(req, { query: value });
  next();
});
const validateParams = (schema) => catchAsync(async (req, _, next) => {
  const { error, value } = schema.validate(req.params || {}, { abortEarly: false });
  if (error) {
    throw new ValidationError("Invalid URL parameters", error);
  }
  Object.assign(req, { params: value });
  next();
});
export {
  validateBody,
  validateParams,
  validateQuery
};
