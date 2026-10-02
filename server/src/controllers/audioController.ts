import { Request, Response } from "express";
import { Audio } from "../models/Audio";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

/** Public: List audio items */
export const listAudio = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  const category = req.query.category as string;
  const q = req.query.q as string;
  const featured = req.query.featured === "true";

  const filter: Record<string, any> = {};
  if (category && category !== "all") {
    filter.category = category;
  }
  if (featured) {
    filter.featured = true;
  }
  if (q) {
    filter.$or = [
      { titleMalayalam: { $regex: q, $options: "i" } },
      { titleEnglish: { $regex: q, $options: "i" } },
      { descriptionMalayalam: { $regex: q, $options: "i" } },
      { descriptionEnglish: { $regex: q, $options: "i" } },
      { narrator: { $regex: q, $options: "i" } },
    ];
  }

  const [items, total] = await Promise.all([
    Audio.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Audio.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: {
      page,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/** Public: Get single audio item */
export const getAudioById = asyncHandler(async (req: Request, res: Response) => {
  const item = await Audio.findById(req.params.id);
  if (!item) throw ApiError.notFound("Audio item not found");
  res.json({ success: true, data: item });
});

/** Public: Increment play count */
export const incrementPlays = asyncHandler(async (req: Request, res: Response) => {
  const item = await Audio.findByIdAndUpdate(
    req.params.id,
    { $inc: { playsCount: 1 } },
    { new: true }
  );
  if (!item) throw ApiError.notFound("Audio item not found");
  res.json({ success: true, playsCount: item.playsCount });
});

/** Public: Like audio item */
export const likeAudio = asyncHandler(async (req: Request, res: Response) => {
  const action = req.body.action || "like";
  const inc = action === "unlike" ? -1 : 1;

  const item = await Audio.findByIdAndUpdate(
    req.params.id,
    { $inc: { likesCount: inc } },
    { new: true }
  );
  if (!item) throw ApiError.notFound("Audio item not found");
  res.json({
    success: true,
    likesCount: Math.max(0, item.likesCount),
    action: action === "unlike" ? "unliked" : "liked",
  });
});

/** Admin: Create audio item */
export const createAudio = asyncHandler(async (req: Request, res: Response) => {
  const {
    titleMalayalam,
    titleEnglish,
    descriptionMalayalam,
    descriptionEnglish,
    audioUrl,
    coverImage,
    category,
    duration,
    narrator,
    featured,
  } = req.body;

  if (!audioUrl) throw ApiError.badRequest("Audio file URL is required");
  if (!titleMalayalam && !titleEnglish) {
    throw ApiError.badRequest("At least one title (Malayalam or English) is required");
  }

  const audioDoc = await Audio.create({
    titleMalayalam,
    titleEnglish,
    descriptionMalayalam,
    descriptionEnglish,
    audioUrl,
    coverImage,
    category: category || "audio-stories",
    duration: Number(duration) || 0,
    narrator: narrator || "Rajendran Kaippallil",
    featured: Boolean(featured),
  });

  res.status(201).json({ success: true, data: audioDoc });
});

/** Admin: Update audio item */
export const updateAudio = asyncHandler(async (req: Request, res: Response) => {
  const item = await Audio.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) throw ApiError.notFound("Audio item not found");
  res.json({ success: true, data: item });
});

/** Admin: Delete audio item */
export const deleteAudio = asyncHandler(async (req: Request, res: Response) => {
  const item = await Audio.findByIdAndDelete(req.params.id);
  if (!item) throw ApiError.notFound("Audio item not found");
  res.json({ success: true, message: "Audio item deleted successfully" });
});
