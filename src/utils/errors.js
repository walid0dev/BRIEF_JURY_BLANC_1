const ERROR_CODES = {
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT"
};
const formatValidationDetails = (input) => {
  if (!input) return void 0;
  const details = Array.isArray(input) ? input : input.details ?? [];
  return details.map((detail) => `${detail.path.join(".")}: ${detail.message}`);
};
class AppError extends Error {
  statusCode;
  status;
  code;
  message;
  errors;
  constructor(statusCode, code, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.status = "error";
    this.code = code;
    this.message = message;
    if (errors !== void 0) this.errors = errors;
  }
}
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, ERROR_CODES.NOT_FOUND, message);
  }
}
class BadRequestError extends AppError {
  constructor(message = "Bad request", errors) {
    super(400, ERROR_CODES.BAD_REQUEST, message, errors);
  }
}
class ValidationError extends AppError {
  constructor(message = "Validation error", details) {
    const formattedErrors = formatValidationDetails(details);
    super(422, ERROR_CODES.VALIDATION_ERROR, message, formattedErrors);
    if (formattedErrors !== void 0) this.errors = formattedErrors;
  }
}
class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, ERROR_CODES.UNAUTHORIZED, message);
  }
}
class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, ERROR_CODES.FORBIDDEN, message);
  }
}
class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(409, ERROR_CODES.CONFLICT, message);
  }
}
export {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError
};
