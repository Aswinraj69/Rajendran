import { body } from "express-validator";

export const storyValidator = [
  body("titleEnglish")
    .optional({ checkFalsy: true })
    .isString(),
  body("titleMalayalam")
    .optional({ checkFalsy: true })
    .isString(),
  body().custom((value) => {
    if (!value.titleEnglish && !value.titleMalayalam) {
      throw new Error("Provide a title in at least one language");
    }
    return true;
  }),
  body("category")
    .optional()
    .isIn(["story", "poem", "essay", "script-note", "article", "other"]),
  body("status").optional().isIn(["draft", "published"]),
  body("tags").optional().isArray(),
];
