import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError";

/** Runs after express-validator chains; turns failures into an ApiError. */
export function validate(req: Request, _res: Response, next: NextFunction) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errorArray = result.array();
    const formattedErrors = errorArray
      .map((err) => (err as { msg?: string }).msg || "Invalid value")
      .filter((msg, idx, arr) => arr.indexOf(msg) === idx)
      .join(". ");
    return next(
      ApiError.badRequest(
        formattedErrors || "Please check the highlighted form fields",
        errorArray
      )
    );
  }
  next();
}
