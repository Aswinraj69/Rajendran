import { Router } from "express";
import {
  createContactMessage,
  listContactMessages,
  toggleContactMessageRead,
  deleteContactMessage,
} from "../controllers/contactController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public: Submit inquiry/contact
router.post("/", createContactMessage);

// Admin protected routes
router.get("/", requireAuth, listContactMessages);
router.patch("/:id/read", requireAuth, toggleContactMessageRead);
router.delete("/:id", requireAuth, deleteContactMessage);

export default router;
