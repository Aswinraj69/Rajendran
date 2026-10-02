import { body } from "express-validator";

export const videoValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("youtubeUrl").trim().notEmpty().withMessage("A YouTube URL is required"),
  body("category")
    .optional()
    .isIn([
      "interviews",
      "stories",
      "script",
      "talks",
      "music",
      "short-films",
      "youtube",
      "other",
    ]),
];
