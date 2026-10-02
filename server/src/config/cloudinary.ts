import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

/**
 * Central Cloudinary config. Only images/audio URLs + metadata are ever
 * stored in MongoDB — the binary files themselves live in Cloudinary.
 *
 * The app is intentionally written against a small `mediaStorage` surface
 * (see services/mediaService.ts once media upload routes are added) so the
 * provider can be swapped for S3 or Cloudflare R2 without touching
 * controllers.
 */
cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.cloudinary.cloudName &&
    env.cloudinary.apiKey &&
    env.cloudinary.apiSecret
  );
}

export { cloudinary };
