import { Request, Response } from "express";
import { Story } from "../models/Story";
import { Comment } from "../models/Comment";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

/**
 * Resolves a story document by either its Mongo _id or slug
 */
async function findStoryByIdOrSlug(idOrSlug: string) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    const byId = await Story.findById(idOrSlug);
    if (byId) return byId;
  }
  return Story.findOne({ slug: idOrSlug });
}

/** Like a story */
export const likeStory = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const { action } = req.body; // "like" or "unlike", default "like"

  const story = await findStoryByIdOrSlug(idOrSlug);
  if (!story) throw ApiError.notFound("Story not found");

  const increment = action === "unlike" ? -1 : 1;
  const updatedLikes = Math.max(0, (story.likesCount || 0) + increment);

  story.likesCount = updatedLikes;
  await story.save();

  res.json({
    success: true,
    likesCount: story.likesCount,
    action: action === "unlike" ? "unliked" : "liked",
  });
});

/** Share a story (increment share counter) */
export const shareStory = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;

  const story = await findStoryByIdOrSlug(idOrSlug);
  if (!story) throw ApiError.notFound("Story not found");

  story.sharesCount = (story.sharesCount || 0) + 1;
  await story.save();

  res.json({
    success: true,
    sharesCount: story.sharesCount,
  });
});

/** Get comments for a story */
export const getStoryComments = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;

  const story = await findStoryByIdOrSlug(idOrSlug);
  if (!story) throw ApiError.notFound("Story not found");

  const comments = await Comment.find({ storyId: story._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: comments,
    total: comments.length,
  });
});

/** Post a new comment on a story */
export const addStoryComment = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const { authorName, authorEmail, content } = req.body;

  if (!authorName || typeof authorName !== "string" || !authorName.trim()) {
    throw ApiError.badRequest("Please enter your name");
  }
  if (!content || typeof content !== "string" || !content.trim()) {
    throw ApiError.badRequest("Comment content cannot be empty");
  }

  const story = await findStoryByIdOrSlug(idOrSlug);
  if (!story) throw ApiError.notFound("Story not found");

  const comment = await Comment.create({
    storyId: story._id,
    authorName: authorName.trim(),
    authorEmail: authorEmail?.trim() || undefined,
    content: content.trim(),
  });

  story.commentsCount = (story.commentsCount || 0) + 1;
  await story.save();

  res.status(201).json({
    success: true,
    data: comment,
    commentsCount: story.commentsCount,
  });
});

/** Admin: List all comments across the entire site */
export const listAllComments = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  const [comments, total] = await Promise.all([
    Comment.find()
      .populate("storyId", "titleEnglish titleMalayalam slug")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Comment.countDocuments(),
  ]);

  res.json({
    success: true,
    data: comments,
    pagination: {
      page,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

/** Admin: Delete an inappropriate comment */
export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);
  if (!comment) {
    throw ApiError.notFound("Comment not found");
  }

  // Decrement comments count on story
  if (comment.storyId) {
    await Story.findByIdAndUpdate(comment.storyId, {
      $inc: { commentsCount: -1 },
    });
  }

  await comment.deleteOne();

  res.json({
    success: true,
    message: "Comment deleted successfully",
  });
});
