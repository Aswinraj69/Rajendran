import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];
