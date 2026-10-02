import { Router } from "express";
import {
  listAudio,
  getAudioById,
  incrementPlays,
  likeAudio,
  createAudio,
  updateAudio,
  deleteAudio,
} from "../controllers/audioController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", listAudio);
router.get("/:id", getAudioById);
router.post("/:id/play", incrementPlays);
router.post("/:id/like", likeAudio);

// Admin routes
router.post("/admin", requireAuth, createAudio);
router.put("/admin/:id", requireAuth, updateAudio);
router.delete("/admin/:id", requireAuth, deleteAudio);

export default router;
