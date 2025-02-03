import mongoose from "mongoose";
import { WithId } from "mongodb";
import { CommentDBViewModel } from "./DBModel";

export const CommentSchema = new mongoose.Schema<WithId<CommentDBViewModel>>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
    required: true,
  },
  commentatorInfo: {
    userId: {
      type: String,
      required: true,
    },
    userLogin: {
      type: String,
      required: true,
    },
  },
  postId: {
    type: String,
    required: true,
    ref: "Post",
  },
});

export const CommentModel = mongoose.model<CommentDBViewModel>(
  "comments",
  CommentSchema
);
