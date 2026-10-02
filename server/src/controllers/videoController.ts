import { Request, Response } from "express";
import { Video } from "../models/Video";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { extractYouTubeVideoId, buildYouTubeThumbnail } from "../utils/youtube";

const PAGE_SIZE = 12;

/** Public: list videos, newest first, with optional category filter. */
export const listPublicVideos = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || PAGE_SIZE));
  const category = req.query.category as string | undefined;
  const featuredOnly = req.query.featured === "true";

  const filter: Record<string, unknown> = {};
  if (category && category !== "all") filter.category = category;
  if (featuredOnly) filter.featured = true;

  const [items, total] = await Promise.all([
    Video.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Video.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
});

export const getPublicVideoById = asyncHandler(async (req: Request, res: Response) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw ApiError.notFound("Video not found");
  res.json({ success: true, data: video });
});

export const listAdminVideos = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const search = req.query.q as string | undefined;

  const filter: Record<string, unknown> = {};
  if (search) filter.title = new RegExp(search, "i");

  const [items, total] = await Promise.all([
    Video.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
    Video.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
});

/**
 * Admin creates a video by pasting any YouTube URL shape. The video ID,
 * embed URL, and a default thumbnail are derived automatically — the admin
 * never has to look up or paste an ID.
 */
export const createVideo = asyncHandler(async (req: Request, res: Response) => {
  const { youtubeUrl, title, description, category, featured, publishedAt } = req.body;

  const videoId = extractYouTubeVideoId(youtubeUrl);
  if (!videoId) {
    throw ApiError.badRequest("That doesn't look like a valid YouTube URL");
  }

  const video = await Video.create({
    title,
    description,
    youtubeUrl,
    youtubeVideoId: videoId,
    thumbnail: buildYouTubeThumbnail(videoId),
    category,
    featured,
    publishedAt: publishedAt || new Date(),
  });

  res.status(201).json({ success: true, data: video });
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw ApiError.notFound("Video not found");

  const updates = { ...req.body };

  if (updates.youtubeUrl) {
    const videoId = extractYouTubeVideoId(updates.youtubeUrl);
    if (!videoId) throw ApiError.badRequest("That doesn't look like a valid YouTube URL");
    updates.youtubeVideoId = videoId;
    updates.thumbnail = buildYouTubeThumbnail(videoId);
  }

  Object.assign(video, updates);
  await video.save();

  res.json({ success: true, data: video });
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) throw ApiError.notFound("Video not found");
  res.json({ success: true, message: "Video deleted" });
});
