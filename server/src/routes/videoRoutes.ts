import { Router } from "express";
import {
  listPublicVideos,
  getPublicVideoById,
  listAdminVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "../controllers/videoController";
import { requireAuth } from "../middleware/auth";
import { videoValidator } from "../validators/videoValidator";
import { validate } from "../validators/validate";

const router = Router();

// Public
router.get("/", listPublicVideos);
router.get("/:id", getPublicVideoById);

// Admin
router.get("/admin/all", requireAuth, listAdminVideos);
router.post("/admin", requireAuth, videoValidator, validate, createVideo);
router.put("/admin/:id", requireAuth, updateVideo);
router.delete("/admin/:id", requireAuth, deleteVideo);

export default router;
