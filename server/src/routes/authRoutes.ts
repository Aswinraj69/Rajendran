import { Router } from "express";
import { login, logout, me } from "../controllers/authController";
import { loginValidator } from "../validators/authValidator";
import { validate } from "../validators/validate";
import { requireAuth } from "../middleware/auth";
import { loginRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", loginRateLimiter, loginValidator, validate, login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
