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
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  cors({
    origin: env.clientUrl,
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
