import { Router } from "express";
import authRoutes from "./authRoutes";
import storyRoutes from "./storyRoutes";
import videoRoutes from "./videoRoutes";
import dashboardRoutes from "./dashboardRoutes";
import youtubeRoutes from "./youtubeRoutes";
import siteContentRoutes from "./siteContentRoutes";
import uploadRoutes from "./uploadRoutes";
import engagementRoutes from "./engagementRoutes";
import audioRoutes from "./audioRoutes";
import contactRoutes from "./contactRoutes";
import horoscopeRoutes from "./horoscopeRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/stories", storyRoutes);
router.use("/videos", videoRoutes);
router.use("/audio", audioRoutes);
router.use("/horoscope", horoscopeRoutes);
router.use("/contact", contactRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/youtube", youtubeRoutes);
router.use("/site-content", siteContentRoutes);
router.use("/upload", uploadRoutes);
router.use("/engagement", engagementRoutes);
router.use("/", engagementRoutes); // Also mount at root for /stories/:idOrSlug/like etc.

export default router;
