import { Router } from "express";
import {
  uploadImage,
  uploadMiddleware,
  uploadAudio,
  uploadAudioMiddleware,
} from "../controllers/uploadController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Allow authenticated admin to upload thumbnails/images
router.post("/", requireAuth, uploadMiddleware.single("image"), uploadImage);

// Allow authenticated admin to upload audio files
router.post("/audio", requireAuth, uploadAudioMiddleware.single("audio"), uploadAudio);

export default router;
