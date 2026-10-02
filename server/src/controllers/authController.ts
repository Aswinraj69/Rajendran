import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { env, isProduction } from "../config/env";

function issueToken(res: Response, userId: string, role: "admin") {
  const token = jwt.sign({ userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);

  res.cookie(env.cookieName, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user) throw ApiError.unauthorized("Incorrect email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized("Incorrect email or password");

  issueToken(res, user.id, user.role);

  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie(env.cookieName);
  res.json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized();

  const user = await User.findById(req.user.userId);
  if (!user) throw ApiError.unauthorized();

  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});
