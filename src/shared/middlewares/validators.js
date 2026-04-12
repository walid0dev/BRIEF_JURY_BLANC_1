import { ValidationError } from "../../utils/errors.js";
const validateBody = (schema) => async (req, _, next) => {
  const { error, value } = schema.validate(req.body || {}, { abortEarly: false  });
  if (error) {
    throw new ValidationError("Invalid request body", error);
  }
  
  Object.assign(req, { body: value });
  next();
};
const validateQuery = (schema) => async (req, _, next) => {
  const { error, value } = schema.validate(req.query || {}, { abortEarly: false });
  if (error) {
    throw new ValidationError("Invalid query parameters", error);
  }
  Object.defineProperties(req, {
    query: {
      value,
      writable: true,
      enumerable: true,
      configurable: true,
    },
  });
  next();
};
const validateParams = (schema) => async (req, _, next) => {
  const { error, value } = schema.validate(req.params || {}, { abortEarly: false });
  if (error) {
    throw new ValidationError("Invalid URL parameters", error);
  }
  Object.assign(req, { params: value });
  next();
};
export {
  validateBody,
  validateParams,
  validateQuery
};
