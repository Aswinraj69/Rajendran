import { Router } from "express";
import {
  likeStory,
  shareStory,
  getStoryComments,
  addStoryComment,
  listAllComments,
  deleteComment,
} from "../controllers/engagementController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public engagement endpoints
router.post("/stories/:idOrSlug/like", likeStory);
router.post("/stories/:idOrSlug/share", shareStory);
router.get("/stories/:idOrSlug/comments", getStoryComments);
router.post("/stories/:idOrSlug/comments", addStoryComment);

// Admin comment moderation endpoints
router.get("/admin/comments", requireAuth, listAllComments);
router.delete("/admin/comments/:id", requireAuth, deleteComment);

export default router;
