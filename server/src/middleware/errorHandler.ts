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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500;
  let message = "Something went wrong on our end";
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = isProduction ? message : err.message;
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
