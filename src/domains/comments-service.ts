

import { CommentInputModel } from "../models/CommentModel";
import { commentsDBRepository } from "../repositories/commentsDBRepository";

export const commentsService = {

  async updateComment(commentId: string, comment: CommentInputModel): Promise<boolean> {
    return commentsDBRepository.updateComment(commentId, comment)
  },

  async deleteComment(commentId: string): Promise<boolean> {
    return commentsDBRepository.deleteComment(commentId)
  },

}

