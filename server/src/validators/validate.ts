import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

/** Runs after express-validator chains; turns failures into an ApiError. */
export function validate(req: Request, _res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(ApiError.badRequest("Please check the highlighted fields", result.array()));
  }
  next();
}
