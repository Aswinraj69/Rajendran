import { NextFunction, Request, Response } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async Express route handler so rejected promises are forwarded
 * to next() instead of crashing the process or requiring try/catch in every
 * controller.
 */
export const asyncHandler =
  (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
