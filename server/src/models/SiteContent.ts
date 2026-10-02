import { Schema, model, Document, Model } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  value: string;
  section?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true, trim: true, index: true },
    value: { type: String, default: "" },
    section: { type: String, trim: true },
  },
  { timestamps: true }
);

export const SiteContent: Model<ISiteContent> = model<ISiteContent>(
  "SiteContent",
  SiteContentSchema
);
