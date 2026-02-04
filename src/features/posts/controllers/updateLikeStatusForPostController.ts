import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { LikeStatusInputModel } from '../../../models/CommentModel';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { postsService } from '../../../domains/posts-service';

export const updateLikeStatusForPostController = async (
  req: Request<{ postId: string }, any, LikeStatusInputModel>,
  res: Response<null | ErrorResultModel>
) => {
  try {
    const { postId } = req.params;
    const { likeStatus } = req.body;
    const userId = req.user!.id;
    const login = req.user!.login;

    // Check if post exists
    const post = await postsQueryRepository.findPost(postId);
    if (!post) {
      return res.status(404).json({
        errorsMessages: [{ message: 'Post not found', field: 'postId' }]
      });
    }

    // Update the like status
    await postsService.updateLikeStatus(postId, userId, login, likeStatus);

    return res.sendStatus(204);
  } catch (error) {
    console.error('Error updating like status:', error);
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
