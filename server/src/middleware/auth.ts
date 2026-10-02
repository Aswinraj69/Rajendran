import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { JwtPayload } from "../types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Reads the JWT from the http-only cookie, verifies it, and attaches the
 * decoded payload to req.user. Rejects with 401 if missing/invalid so
 * downstream route handlers never have to think about auth state.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[env.cookieName];

  if (!token) {
    return next(ApiError.unauthorized("You must be logged in to do that"));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    next(ApiError.unauthorized("Your session has expired. Please log in again"));
  }
}

/** Placeholder for future roles beyond a single admin account. */
export function requireRole(...roles: JwtPayload["role"][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden());
    }
    next();
  };
}
