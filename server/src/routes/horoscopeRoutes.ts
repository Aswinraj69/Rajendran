import { Router } from "express";
import {
  getDailyHoroscope,
  checkPorutham,
  checkChovvaDosham,
} from "../controllers/horoscopeController";

const router = Router();

// Public Horoscope Endpoints
router.get("/daily", getDailyHoroscope);
router.post("/porutham", checkPorutham);
router.post("/chovva-dosham", checkChovvaDosham);

export default router;
