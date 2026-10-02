import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import apiRoutes from "./routes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, etc.)
      if (!origin) return callback(null, true);

      // List of explicitly allowed domains
      const allowed = [
        env.clientUrl,
        "https://rajendrankaipallil.com",
        "https://www.rajendrankaipallil.com",
        "http://localhost:5173",
        "http://localhost:3000",
      ];

      if (
        allowed.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        origin.includes("rajendrankaipallil.com") ||
        origin.includes("localhost")
      ) {
        return callback(null, true);
      }

      // Default allow with origin reflect for flexible hosting
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Rajendran Kaipallil API is running" });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
