import { Schema, model, Document, Model } from "mongoose";

export type VideoCategory =
  | "interviews"
  | "stories"
  | "script"
  | "talks"
  | "music"
  | "short-films"
  | "youtube"
  | "other";

export interface IVideo extends Document {
  title: string;
  description?: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnail?: string;
  category: VideoCategory;
  featured: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    youtubeUrl: { type: String, required: true },
    youtubeVideoId: { type: String, required: true, index: true },
    thumbnail: { type: String },
    category: {
      type: String,
      enum: [
        "interviews",
        "stories",
        "script",
        "talks",
        "music",
        "short-films",
        "youtube",
        "other",
      ],
      default: "youtube",
    },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

VideoSchema.index({ publishedAt: -1 });

export const Video: Model<IVideo> = model<IVideo>("Video", VideoSchema);
