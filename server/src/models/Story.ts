import { Schema, model, Document, Model } from "mongoose";

export type StoryCategory =
  | "story"
  | "poem"
  | "essay"
  | "script-note"
  | "article"
  | "other";

export interface IStory extends Document {
  titleMalayalam?: string;
  titleEnglish?: string;
  slug: string;
  excerptMalayalam?: string;
  excerptEnglish?: string;
  contentMalayalam?: string;
  contentEnglish?: string;
  coverImage?: string;
  category: StoryCategory;
  tags: string[];
  featured: boolean;
  status: "draft" | "published";
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    titleMalayalam: { type: String, trim: true },
    titleEnglish: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true },
    excerptMalayalam: { type: String, trim: true },
    excerptEnglish: { type: String, trim: true },
    // Rich HTML/JSON content from the Tiptap editor, stored per language.
    contentMalayalam: { type: String },
    contentEnglish: { type: String },
    coverImage: { type: String },
    category: {
      type: String,
      enum: ["story", "poem", "essay", "script-note", "article", "other"],
      default: "story",
    },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    likesCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

StorySchema.index({ status: 1, publishedAt: -1 });
StorySchema.index({ titleEnglish: "text", titleMalayalam: "text", tags: "text" });

export const Story: Model<IStory> = model<IStory>("Story", StorySchema);
