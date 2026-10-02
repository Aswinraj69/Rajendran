import { Schema, model, Document, Model } from "mongoose";

/**
 * Schema defined per the project spec. CRUD routes for Books are not wired
 * up in this first core pass (auth + Stories + Videos) — this model exists
 * so the next pass (Books/Projects/Audio/Media) can be added without any
 * schema design work.
 */
export interface IBook extends Document {
  titleMalayalam?: string;
  titleEnglish?: string;
  slug: string;
  descriptionMalayalam?: string;
  descriptionEnglish?: string;
  coverImage?: string;
  year?: number;
  genre?: string;
  publisher?: string;
  links: { label: string; url: string }[];
  awards: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    titleMalayalam: { type: String, trim: true },
    titleEnglish: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    descriptionMalayalam: { type: String },
    descriptionEnglish: { type: String },
    coverImage: { type: String },
    year: { type: Number },
    genre: { type: String },
    publisher: { type: String },
    links: [{ label: String, url: String }],
    awards: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Book: Model<IBook> = model<IBook>("Book", BookSchema);
