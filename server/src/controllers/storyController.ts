import { Request, Response } from "express";
import slugify from "slugify";
import { Story } from "../models/Story";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const PAGE_SIZE = 12;

async function generateUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = slugify(base, { lower: true, strict: true }) || `story-${Date.now()}`;
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await Story.findOne({ slug, _id: { $ne: ignoreId } });
    if (!existing) return slug;
    suffix += 1;
    slug = `${slugify(base, { lower: true, strict: true })}-${suffix}`;
  }
}

/** Public: list published stories with pagination, category and search filters. */
export const listPublicStories = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const category = req.query.category as string | undefined;
  const search = req.query.q as string | undefined;
  const featuredOnly = req.query.featured === "true";

  const filter: Record<string, unknown> = { status: "published" };
  if (category && category !== "all") filter.category = category;
  if (featuredOnly) filter.featured = true;
  if (search) filter.$text = { $search: search };

  const [items, total] = await Promise.all([
    Story.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .select("-contentMalayalam -contentEnglish"),
    Story.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
});

/** Public: fetch a single published story by slug, plus a few related stories. */
export const getPublicStoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const story = await Story.findOne({ slug: req.params.slug, status: "published" });
  if (!story) throw ApiError.notFound("Story not found");

  const related = await Story.find({
    _id: { $ne: story._id },
    status: "published",
    category: story.category,
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .select("-contentMalayalam -contentEnglish");

  res.json({ success: true, data: story, related });
});

/** Admin: list all stories regardless of status, with search/filter/pagination. */
export const listAdminStories = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const status = req.query.status as string | undefined;
  const search = req.query.q as string | undefined;

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;
  if (search) {
    filter.$or = [
      { titleEnglish: new RegExp(search, "i") },
      { titleMalayalam: new RegExp(search, "i") },
    ];
  }

  const [items, total] = await Promise.all([
    Story.find(filter)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE),
    Story.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: items,
    pagination: { page, pageSize: PAGE_SIZE, total, totalPages: Math.ceil(total / PAGE_SIZE) },
  });
});

export const getAdminStoryById = asyncHandler(async (req: Request, res: Response) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw ApiError.notFound("Story not found");
  res.json({ success: true, data: story });
});

export const createStory = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body;
  const baseForSlug = body.titleEnglish || body.titleMalayalam;
  const slug = await generateUniqueSlug(baseForSlug);

  const story = await Story.create({
    ...body,
    slug,
    publishedAt: body.status === "published" ? new Date() : undefined,
  });

  res.status(201).json({ success: true, data: story });
});

export const updateStory = asyncHandler(async (req: Request, res: Response) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw ApiError.notFound("Story not found");

  const wasPublished = story.status === "published";
  Object.assign(story, req.body);

  if (!wasPublished && story.status === "published" && !story.publishedAt) {
    story.publishedAt = new Date();
  }

  await story.save();
  res.json({ success: true, data: story });
});

export const deleteStory = asyncHandler(async (req: Request, res: Response) => {
  const story = await Story.findByIdAndDelete(req.params.id);
  if (!story) throw ApiError.notFound("Story not found");
  res.json({ success: true, message: "Story deleted" });
});
