import { ApiError } from "../utils/ApiError.js";

// Standardized error-handling middleware so that unhandled errors (e.g.
// Mongoose write failures such as duplicate-key / cast errors) never bubble
// up to Express' default handler as a raw 500. All responses are JSON and
// follow the { success, message, errors } shape used by ApiError/ApiResponse.
const errorHandler = (err, req, res, next) => {
  // Already a structured API error -> use its status code / message
  if (err instanceof ApiError) {
    const response = {
      success: false,
      message: err.message || "Something went wrong",
      errors: err.errors || [],
    };

    if (process.env.NODE_ENV === "development") {
      response.stack = err.stack;
    }

    return res.status(err.statusCode).json(response);
  }

  // Mongoose validation error -> 400
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((fieldError) => fieldError.message);
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
  }

  // Mongoose cast error (invalid ObjectId, wrong type, etc.) -> 400
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
      errors: [],
    });
  }

  // Mongoose duplicate key error (E11000) -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      errors: [],
    });
  }

  // Generic unexpected server error -> 500
  const response = {
    success: false,
    message: err.message || "Internal Server Error",
    errors: [],
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  return res.status(500).json(response);
};

export { errorHandler };
