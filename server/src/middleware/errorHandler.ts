import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { isProduction } from "../config/env";

/** 404 fallback for unmatched routes. Must be registered after all routes. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Centralized error handler. Always returns a consistent JSON shape and
 * never leaks stack traces or internals to the client in production.
 */
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = "Something went wrong on our end";
  let details: unknown;

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  }
  // Handle Multer errors
  else if (err && typeof err === "object" && "name" in err && err.name === "MulterError") {
    statusCode = 400;
    const multerErr = err as { code?: string; message?: string };
    if (multerErr.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Images must be under 25MB, and audio files under 100MB.";
    } else if (multerErr.code === "LIMIT_UNEXPECTED_FILE") {
      message = "Unexpected file field in upload request.";
    } else {
      message = multerErr.message || "File upload error.";
    }
  }
  // Handle Payload Too Large (Express body-parser)
  else if (err && typeof err === "object" && "type" in err && (err as { type: string }).type === "entity.too.large") {
    statusCode = 413;
    message = "Request body payload is too large. Please reduce image or text size.";
  }
  // Handle Mongoose / General operational validation errors
  else if (err instanceof Error) {
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = err.message;
    } else if (err.message.includes("allowed") || err.message.includes("required") || err.message.includes("Invalid")) {
      statusCode = 400;
      message = err.message;
    } else {
      message = isProduction ? "An unexpected error occurred. Please try again." : err.message;
    }
  }

  if (!isProduction) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
