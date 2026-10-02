import { Schema, model, Document, Model } from "mongoose";

export type AudioCategory =
  | "music"
  | "poetry"
  | "audio-stories"
  | "voice"
  | "podcasts"
  | "background-music"
  | "other";

export interface IAudio extends Document {
  titleMalayalam?: string;
  titleEnglish?: string;
  descriptionMalayalam?: string;
  descriptionEnglish?: string;
  audioUrl: string;
  coverImage?: string;
  category: AudioCategory;
  duration?: number; // duration in seconds
  narrator?: string;
  featured: boolean;
  playsCount: number;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AudioSchema = new Schema<IAudio>(
  {
    titleMalayalam: { type: String, trim: true },
    titleEnglish: { type: String, trim: true },
    descriptionMalayalam: { type: String },
    descriptionEnglish: { type: String },
    audioUrl: { type: String, required: true },
    coverImage: { type: String },
    category: {
      type: String,
      enum: ["music", "poetry", "audio-stories", "voice", "podcasts", "background-music", "other"],
      default: "audio-stories",
    },
    duration: { type: Number, default: 0 },
    narrator: { type: String, default: "Rajendran Kaippallil" },
    featured: { type: Boolean, default: false },
    playsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Audio: Model<IAudio> = model<IAudio>("Audio", AudioSchema);
