import { Request, Response } from "express";
import https from "https";
import { Video } from "../models/Video";
import { YouTubePost } from "../models/YouTubePost";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

const CHANNEL_VIDEOS_URL = "https://www.youtube.com/@rajendran131/videos";
const CHANNEL_COMMUNITY_URL = "https://www.youtube.com/@rajendran131/community";

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", (err) => reject(err));
  });
}

function parseYtInitialData(html: string): any {
  const match = html.match(/var ytInitialData = ({[\s\S]*?});<\/script>/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/** Recursively search for objects matching predicate */
function findNodes(obj: any, predicate: (o: any) => boolean, results: any[] = []) {
  if (!obj || typeof obj !== "object") return results;
  if (predicate(obj)) {
    results.push(obj);
  }
  if (Array.isArray(obj)) {
    for (const item of obj) {
      findNodes(item, predicate, results);
    }
  } else {
    for (const key of Object.keys(obj)) {
      findNodes(obj[key], predicate, results);
    }
  }
  return results;
}

/** Extract video details from lockupViewModel or gridVideoRenderer */
function extractVideosFromData(ytData: any) {
  const videos: Array<{
    videoId: string;
    title: string;
    description: string;
    publishedTimeText?: string;
  }> = [];

  const seenIds = new Set<string>();

  // 1. Check lockupViewModel
  const lockupNodes = findNodes(ytData, (o) => o && o.lockupViewModel);
  for (const node of lockupNodes) {
    const l = node.lockupViewModel;
    if (!l) continue;
    const videoId = l.contentId;
    if (!videoId || seenIds.has(videoId)) continue;
    seenIds.add(videoId);

    const meta = l.metadata?.lockupMetadataViewModel;
    let title = meta?.title?.content || "";
    if (title.startsWith("🎬 Title")) {
      title = title.replace(/^🎬 Title\s*/, "");
    }

    if (title) {
      videos.push({ videoId, title, description: title, publishedTimeText: "" });
    }
  }

  // 2. Check gridVideoRenderer / videoRenderer fallback
  const videoRenderers = findNodes(ytData, (o) => o && (o.gridVideoRenderer || o.videoRenderer));
  for (const node of videoRenderers) {
    const v = node.gridVideoRenderer || node.videoRenderer;
    const videoId = v?.videoId;
    if (!videoId || seenIds.has(videoId)) continue;
    seenIds.add(videoId);

    const title = v?.title?.runs?.map((r: any) => r.text).join("") || v?.title?.simpleText || "";
    const publishedTimeText = v?.publishedTimeText?.simpleText || "";
    const description = v?.descriptionSnippet?.runs?.map((r: any) => r.text).join("") || "";

    if (title) {
      videos.push({ videoId, title, description, publishedTimeText });
    }
  }

  return videos;
}

/** Extract community posts from backstagePostRenderer */
function extractCommunityPostsFromData(ytData: any) {
  const posts: Array<{
    postId: string;
    content: string;
    images: string[];
    youtubeVideoId?: string;
    videoTitle?: string;
    publishedTimeText?: string;
  }> = [];

  const postNodes = findNodes(ytData, (o) => o && o.backstagePostRenderer);
  const seenPosts = new Set<string>();

  for (const node of postNodes) {
    const p = node.backstagePostRenderer;
    const postId = p.postId;
    if (!postId || seenPosts.has(postId)) continue;
    seenPosts.add(postId);

    const contentRuns = p.contentText?.runs || [];
    const content = contentRuns.map((r: any) => r.text).join("");

    const publishedTimeText = p.publishedTimeText?.runs?.map((r: any) => r.text).join("") || "";

    // Extract attachments (images or video links)
    const images: string[] = [];
    let youtubeVideoId: string | undefined;
    let videoTitle: string | undefined;

    const attachments = p.backstageAttachment || p.attachment;
    if (attachments) {
      // Image attachment
      const imageRenderers = findNodes(attachments, (o) => o && o.backstageImageRenderer);
      for (const imgNode of imageRenderers) {
        const thumbs = imgNode.backstageImageRenderer?.image?.thumbnails || [];
        if (thumbs.length > 0) {
          const bestThumb = thumbs[thumbs.length - 1]?.url;
          if (bestThumb) images.push(bestThumb);
        }
      }

      // Video attachment
      const videoRenderers = findNodes(attachments, (o) => o && o.videoRenderer);
      if (videoRenderers.length > 0) {
        const v = videoRenderers[0].videoRenderer;
        youtubeVideoId = v?.videoId;
        videoTitle = v?.title?.runs?.map((r: any) => r.text).join("") || v?.title?.simpleText;
      }
    }

    if (content || images.length > 0 || youtubeVideoId) {
      posts.push({
        postId,
        content: content || "YouTube Community Post",
        images,
        youtubeVideoId,
        videoTitle,
        publishedTimeText,
      });
    }
  }

  return posts;
}

/**
 * Sync all latest videos & community posts directly from Rajendran Kaippallil's YouTube channel
 * scraping ytInitialData.
 */
export const syncChannelContent = asyncHandler(async (_req: Request, res: Response) => {
  let videoSyncCount = 0;
  let postSyncCount = 0;
  const syncedVideos = [];

  // 1. Sync Videos
  try {
    const videosHtml = await fetchHtml(CHANNEL_VIDEOS_URL);
    const ytData = parseYtInitialData(videosHtml);

    if (ytData) {
      const extractedVideos = extractVideosFromData(ytData);

      for (const item of extractedVideos) {
        let category = "youtube";
        const lower = item.title.toLowerCase();
        if (lower.includes("കഥ") || lower.includes("story") || lower.includes("രാജകുമാരി")) {
          category = "stories";
        } else if (lower.includes("short film") || lower.includes("ഹ്രസ്വചിത്രം")) {
          category = "short-films";
        } else if (lower.includes("തിരക്കഥ") || lower.includes("script")) {
          category = "script";
        } else if (lower.includes("അഭിമുഖം") || lower.includes("interview")) {
          category = "interviews";
        } else if (lower.includes("വിശകലനം") || lower.includes("നക്ഷത്ര")) {
          category = "talks";
        }

        const videoDoc = await Video.findOneAndUpdate(
          { youtubeVideoId: item.videoId },
          {
            title: item.title,
            description: item.description || item.title,
            youtubeUrl: `https://www.youtube.com/watch?v=${item.videoId}`,
            youtubeVideoId: item.videoId,
            thumbnail: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
            category,
            featured: true,
            publishedAt: new Date(),
          },
          { upsert: true, new: true }
        );
        syncedVideos.push(videoDoc);
        videoSyncCount++;
      }
    }
  } catch (err) {
    console.error("Failed to sync YouTube videos:", err);
  }

  // 2. Sync Community Posts
  try {
    const communityHtml = await fetchHtml(CHANNEL_COMMUNITY_URL);
    const ytCommunityData = parseYtInitialData(communityHtml);

    if (ytCommunityData) {
      const extractedPosts = extractCommunityPostsFromData(ytCommunityData);

      for (const postItem of extractedPosts) {
        await YouTubePost.findOneAndUpdate(
          { content: postItem.content },
          {
            content: postItem.content,
            images: postItem.images,
            youtubeVideoId: postItem.youtubeVideoId,
            videoTitle: postItem.videoTitle,
            youtubeUrl: postItem.youtubeVideoId
              ? `https://www.youtube.com/watch?v=${postItem.youtubeVideoId}`
              : undefined,
            publishedAt: new Date(),
          },
          { upsert: true, new: true }
        );
        postSyncCount++;
      }
    }
  } catch (err) {
    console.error("Failed to sync YouTube community posts:", err);
  }

  res.json({
    success: true,
    message: `Successfully synced ${videoSyncCount} videos and ${postSyncCount} community posts from @rajendran131!`,
    syncedVideosCount: videoSyncCount,
    syncedPostsCount: postSyncCount,
    videos: syncedVideos,
  });
});

/** Public: list all YouTube community posts */
export const listYouTubePosts = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 15));

  const [posts, total] = await Promise.all([
    YouTubePost.find()
      .sort({ pinned: -1, publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    YouTubePost.countDocuments(),
  ]);

  res.json({
    success: true,
    data: posts,
    pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
});

/** Admin: create custom community post */
export const createYouTubePost = asyncHandler(async (req: Request, res: Response) => {
  const { content, images, youtubeVideoId, videoTitle, youtubeUrl, pinned } = req.body;
  if (!content) throw ApiError.badRequest("Post content is required");

  const post = await YouTubePost.create({
    content,
    images: images || [],
    youtubeVideoId,
    videoTitle,
    youtubeUrl: youtubeUrl || (youtubeVideoId ? `https://www.youtube.com/watch?v=${youtubeVideoId}` : undefined),
    pinned: Boolean(pinned),
    publishedAt: new Date(),
  });

  res.status(201).json({ success: true, data: post });
});

/** Admin: update post */
export const updateYouTubePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await YouTubePost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!post) throw ApiError.notFound("Post not found");
  res.json({ success: true, data: post });
});

/** Admin: delete post */
export const deleteYouTubePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await YouTubePost.findByIdAndDelete(req.params.id);
  if (!post) throw ApiError.notFound("Post not found");
  res.json({ success: true, message: "Post deleted successfully" });
});
