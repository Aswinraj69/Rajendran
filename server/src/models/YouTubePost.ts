import { Schema, model, Document, Model } from "mongoose";

export interface IYouTubePost extends Document {
  content: string;
  images?: string[];
  youtubeVideoId?: string;
  videoTitle?: string;
  youtubeUrl?: string;
  likesCount: number;
  commentsCount: number;
  publishedAt: Date;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const YouTubePostSchema = new Schema<IYouTubePost>(
  {
    content: { type: String, required: true, trim: true },
    images: [{ type: String }],
    youtubeVideoId: { type: String, trim: true },
    videoTitle: { type: String, trim: true },
    youtubeUrl: { type: String, trim: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    publishedAt: { type: Date, default: Date.now },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

YouTubePostSchema.index({ pinned: -1, publishedAt: -1 });

export const YouTubePost: Model<IYouTubePost> = model<IYouTubePost>(
  "YouTubePost",
  YouTubePostSchema
);
