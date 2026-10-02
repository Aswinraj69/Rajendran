import { Schema, model, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
  storyId: Types.ObjectId;
  authorName: string;
  authorEmail?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    authorEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ storyId: 1, createdAt: -1 });

export const Comment: Model<IComment> = model<IComment>("Comment", CommentSchema);
