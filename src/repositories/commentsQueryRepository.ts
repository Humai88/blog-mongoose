import { ObjectId } from "mongodb";
import { CommentDBViewModel, LikeStatus } from "../models/DBModel";
import { CommentViewModel } from "../models/CommentModel";
import { CommentModel } from "../models/comment-model";
import { CommentLikeModel } from "../models/comment-like-model";


export const commentsQueryRepository = {

  async findComment(id: string, userId?: string): Promise<CommentViewModel | null> {
    const objectId = new ObjectId(id);
    const comment = await CommentModel.findOne({ _id: objectId })
    if (!comment) return null;
    
    const myStatus = userId 
      ? await this.getUserLikeStatus(id, userId) 
      : "None" as LikeStatus;
    
    return this.mapCommentResult(comment, myStatus);
  },

  async getUserLikeStatus(commentId: string, userId: string): Promise<LikeStatus> {
    const existingLike = await CommentLikeModel.findOne({ commentId, userId });
    return existingLike ? existingLike.status : "None";
  },

  mapCommentResult(comment: CommentDBViewModel, myStatus: LikeStatus = "None"): CommentViewModel {
    const commentForOutput: CommentViewModel = {
      id: comment._id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,  
      commentatorInfo: {  
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin
      },
      likesInfo: {
        likesCount: comment.likesInfo?.likesCount || 0,
        dislikesCount: comment.likesInfo?.dislikesCount || 0,
        myStatus: myStatus
      }
    }
    return commentForOutput
  },

}

