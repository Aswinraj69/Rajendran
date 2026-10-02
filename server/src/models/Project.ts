import { Schema, model, Document, Model } from "mongoose";

/** Schema only for now — see note in Book.ts. Covers scripts/film projects. */
export interface IProject extends Document {
  title: string;
  slug: string;
  projectType?: string;
  year?: number;
  description?: string;
  coverImage?: string;
  role?: string;
  productionInfo?: string;
  gallery: string[];
  videos: string[];
  credits: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    projectType: { type: String },
    year: { type: Number },
    description: { type: String },
    coverImage: { type: String },
    role: { type: String },
    productionInfo: { type: String },
    gallery: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    credits: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Project: Model<IProject> = model<IProject>("Project", ProjectSchema);
