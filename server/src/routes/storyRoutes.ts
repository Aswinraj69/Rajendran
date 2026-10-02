import { Router } from "express";
import {
  listPublicStories,
  getPublicStoryBySlug,
  listAdminStories,
  getAdminStoryById,
  createStory,
  updateStory,
  deleteStory,
} from "../controllers/storyController";
import { requireAuth } from "../middleware/auth";
import { storyValidator } from "../validators/storyValidator";
import { validate } from "../validators/validate";

const router = Router();

// Public
router.get("/", listPublicStories);
router.get("/slug/:slug", getPublicStoryBySlug);

// Admin (must come after the public routes above; distinct sub-path avoids collisions)
router.get("/admin/all", requireAuth, listAdminStories);
router.get("/admin/:id", requireAuth, getAdminStoryById);
router.post("/admin", requireAuth, storyValidator, validate, createStory);
router.put("/admin/:id", requireAuth, storyValidator, validate, updateStory);
router.delete("/admin/:id", requireAuth, deleteStory);

export default router;
