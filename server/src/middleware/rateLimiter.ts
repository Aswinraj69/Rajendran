import rateLimit from "express-rate-limit";

/** Protects the login endpoint against brute-force attempts. */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});
