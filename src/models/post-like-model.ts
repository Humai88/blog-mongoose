import mongoose from "mongoose";
import { WithId } from "mongodb";
import { PostLikeDBViewModel } from "./DBModel";

export const PostLikeSchema = new mongoose.Schema<WithId<PostLikeDBViewModel>>({
  postId: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  login: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Like", "Dislike"],
    required: true,
  },
  addedAt: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  },
});

// Compound index to ensure one like/dislike per user per post
PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

// Index for efficient newestLikes query (likes sorted by addedAt descending)
PostLikeSchema.index({ postId: 1, status: 1, addedAt: -1 });

export const PostLikeModel = mongoose.model<PostLikeDBViewModel>(
  "postLikes",
  PostLikeSchema
);
