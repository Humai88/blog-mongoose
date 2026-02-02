import mongoose from "mongoose";
import { WithId } from "mongodb";
import { CommentLikeDBViewModel } from "./DBModel";

export const CommentLikeSchema = new mongoose.Schema<WithId<CommentLikeDBViewModel>>({
  commentId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["Like", "Dislike"],
    required: true,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  },
});

// Compound index to ensure one like/dislike per user per comment
CommentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const CommentLikeModel = mongoose.model<CommentLikeDBViewModel>(
  "commentLikes",
  CommentLikeSchema
);
