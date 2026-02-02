import { ObjectId } from "mongodb";
import { CommentInputModel } from "../models/CommentModel";
import { UserViewModel } from "../models/UserModel";
import { CommentModel } from "../models/comment-model";
import { CommentLikeModel } from "../models/comment-like-model";
import { LikeStatus } from "../models/DBModel";

export const commentsDBRepository = {

  async updateComment(commentId: string, comment: CommentInputModel): Promise<boolean> {
    const objectCommentId = new ObjectId(commentId);
    const result = await CommentModel.updateOne({ _id: objectCommentId }, { $set: { content: comment.content } })
    return result.matchedCount === 1
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const objectBlogId = new ObjectId(commentId);
    const result = await CommentModel.deleteOne({ _id: objectBlogId });
    return result.deletedCount === 1
  },

  async checkIfUserIfAuthorOfComment(user: UserViewModel, commentId: string): Promise<boolean> {
    const objectCommentId = new ObjectId(commentId);
    const commentToUpdateOrDelete = await CommentModel.findOne({ _id: objectCommentId });
    return commentToUpdateOrDelete?.commentatorInfo.userId === user.id;
  },

  async getUserLikeStatus(commentId: string, userId: string): Promise<LikeStatus> {
    const existingLike = await CommentLikeModel.findOne({ commentId, userId });
    return existingLike ? existingLike.status : "None";
  },

  async updateLikeStatus(commentId: string, userId: string, newStatus: LikeStatus): Promise<boolean> {
    const objectCommentId = new ObjectId(commentId);
    
    // Get current status
    const currentStatus = await this.getUserLikeStatus(commentId, userId);
    
    // If same status, do nothing
    if (currentStatus === newStatus) {
      return true;
    }

    // Calculate count changes
    const likesChange = this.calculateLikesChange(currentStatus, newStatus);
    const dislikesChange = this.calculateDislikesChange(currentStatus, newStatus);

    // Update the like record
    if (newStatus === "None") {
      // Remove the like record
      await CommentLikeModel.deleteOne({ commentId, userId });
    } else {
      // Upsert the like record
      await CommentLikeModel.updateOne(
        { commentId, userId },
        { $set: { status: newStatus, createdAt: new Date().toISOString() } },
        { upsert: true }
      );
    }

    // Update the comment's like counts
    await CommentModel.updateOne(
      { _id: objectCommentId },
      {
        $inc: {
          "likesInfo.likesCount": likesChange,
          "likesInfo.dislikesCount": dislikesChange
        }
      }
    );

    return true;
  },

  calculateLikesChange(currentStatus: LikeStatus, newStatus: LikeStatus): number {
    if (currentStatus === "Like" && newStatus !== "Like") return -1;
    if (currentStatus !== "Like" && newStatus === "Like") return 1;
    return 0;
  },

  calculateDislikesChange(currentStatus: LikeStatus, newStatus: LikeStatus): number {
    if (currentStatus === "Dislike" && newStatus !== "Dislike") return -1;
    if (currentStatus !== "Dislike" && newStatus === "Dislike") return 1;
    return 0;
  },
};