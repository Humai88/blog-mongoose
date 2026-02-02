import { CommentInputModel } from "../models/CommentModel";
import { LikeStatus } from "../models/DBModel";
import { commentsDBRepository } from "../repositories/commentsDBRepository";

export const commentsService = {

  async updateComment(commentId: string, comment: CommentInputModel): Promise<boolean> {
    return commentsDBRepository.updateComment(commentId, comment)
  },

  async deleteComment(commentId: string): Promise<boolean> {
    return commentsDBRepository.deleteComment(commentId)
  },

  async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus): Promise<boolean> {
    return commentsDBRepository.updateLikeStatus(commentId, userId, likeStatus)
  },
}
