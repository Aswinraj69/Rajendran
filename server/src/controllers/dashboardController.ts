import { Request, Response } from "express";
import { Story } from "../models/Story";
import { Video } from "../models/Video";
import { Audio } from "../models/Audio";
import { Book } from "../models/Book";
import { Project } from "../models/Project";
import { ContactMessage } from "../models/ContactMessage";
import { Comment } from "../models/Comment";
import { asyncHandler } from "../utils/asyncHandler";

/** Powers the admin dashboard's summary cards + recent activity feed. */
export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const [totalStories, totalVideos, totalAudio, totalBooks, totalProjects, totalMessages, unreadMessages, totalComments] = await Promise.all([
    Story.countDocuments(),
    Video.countDocuments(),
    Audio.countDocuments(),
    Book.countDocuments(),
    Project.countDocuments(),
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ read: false }),
    Comment.countDocuments(),
  ]);

  const [recentStories, recentVideos, recentMessages] = await Promise.all([
    Story.find().sort({ updatedAt: -1 }).limit(5).select("titleEnglish titleMalayalam status updatedAt"),
    Video.find().sort({ updatedAt: -1 }).limit(5).select("title category updatedAt"),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).select("name email subject message read createdAt"),
  ]);

  res.json({
    success: true,
    data: {
      counts: {
        stories: totalStories,
        videos: totalVideos,
        audio: totalAudio,
        books: totalBooks,
        projects: totalProjects,
        messages: totalMessages,
        unreadMessages,
        comments: totalComments,
        media: 0,
      },
      recentStories,
      recentVideos,
      recentMessages,
    },
  });
});
