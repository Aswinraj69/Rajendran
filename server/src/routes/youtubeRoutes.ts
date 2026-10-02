import { Router } from "express";
import {
  syncChannelContent,
  listYouTubePosts,
  createYouTubePost,
  updateYouTubePost,
  deleteYouTubePost,
} from "../controllers/youtubeController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/posts", listYouTubePosts);
router.get("/sync", syncChannelContent); // Can be triggered publicly or via admin
router.post("/sync", syncChannelContent);

// Admin routes
router.post("/posts/admin", requireAuth, createYouTubePost);
router.put("/posts/admin/:id", requireAuth, updateYouTubePost);
router.delete("/posts/admin/:id", requireAuth, deleteYouTubePost);

export default router;
