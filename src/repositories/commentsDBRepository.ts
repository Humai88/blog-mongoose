import { commentsCollection } from "../db/mongo-db"
import { ObjectId } from "mongodb";
import { CommentInputModel } from "../models/CommentModel";
import { UserViewModel } from "../models/UserModel";

export const commentsDBRepository = {

  async updateComment(commentId: string, comment: CommentInputModel): Promise<boolean> {
    const objectCommentId = new ObjectId(commentId);
    const result = await commentsCollection.updateOne({ _id: objectCommentId }, { $set: { content: comment.content } })
    return result.matchedCount === 1
  },

  async deleteComment(commentId: string): Promise<boolean> {
    const objectBlogId = new ObjectId(commentId);
    const result = await commentsCollection.deleteOne({ _id: objectBlogId });
    return result.deletedCount === 1
  },

  async checkIfUserIfAuthorOfComment(user: UserViewModel, commentId: string): Promise<boolean> {
    const objectCommentId = new ObjectId(commentId);
    const commentToUpdateOrDelete = await commentsCollection.findOne({ _id: objectCommentId });
    return commentToUpdateOrDelete?.commentatorInfo.userId === user.id;
  }

}

