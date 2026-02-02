import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { LikeStatusInputModel } from '../../../models/CommentModel';
import { commentsQueryRepository } from '../../../repositories/commentsQueryRepository';
import { commentsService } from '../../../domains/comments-service';

export const updateLikeStatusController = async (
  req: Request<{ commentId: string }, any, LikeStatusInputModel>,
  res: Response<null | ErrorResultModel>
) => {
  try {
    const { commentId } = req.params;
    const { likeStatus } = req.body;
    const userId = req.user!.id;

    // Check if comment exists
    const comment = await commentsQueryRepository.findComment(commentId);
    if (!comment) {
      return res.status(404).json({
        errorsMessages: [{ message: 'Comment not found', field: 'commentId' }]
      });
    }

    // Update the like status
    await commentsService.updateLikeStatus(commentId, userId, likeStatus);

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error updating like status:', error);
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
