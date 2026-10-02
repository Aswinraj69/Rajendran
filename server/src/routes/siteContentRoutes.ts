import { Router } from "express";
import {
  getSiteContent,
  updateSiteContent,
  deleteSiteContent,
} from "../controllers/siteContentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public: Fetch all site content
router.get("/", getSiteContent);

// Admin: Bulk update content and delete keys
router.put("/", requireAuth, updateSiteContent);
router.delete("/:key", requireAuth, deleteSiteContent);

export default router;
