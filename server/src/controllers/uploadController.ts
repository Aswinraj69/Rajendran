import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";

// Ensure local uploads directory exists
const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WEBP, GIF, AVIF) are allowed"));
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("No image file provided");
  }

  const localUrl = `/uploads/${req.file.filename}`;

  // If Cloudinary is configured, upload there as primary
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "rajendran-kaipallil/stories",
        resource_type: "image",
      });

      return res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        filename: req.file.filename,
      });
    } catch {
      // Fallback to local URL if Cloudinary upload fails
      return res.json({
        success: true,
        url: localUrl,
        filename: req.file.filename,
      });
    }
  }

  // Return local static URL
  return res.json({
    success: true,
    url: localUrl,
    filename: req.file.filename,
  });
});

/** Audio File Upload Configuration */
const audioStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `audio-${cleanName}-${uniqueSuffix}${ext}`);
  },
});

const audioFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExts = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype.startsWith("audio/") || allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files (MP3, WAV, M4A, AAC, OGG) are allowed"));
  }
};

export const uploadAudioMiddleware = multer({
  storage: audioStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: audioFileFilter,
});

export const uploadAudio = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw ApiError.badRequest("No audio file provided");
  }

  const localUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    url: localUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
});
