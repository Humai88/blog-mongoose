import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { postsService } from '../../../domains/posts-service';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { CommentInputModel, CommentViewModel } from '../../../models/CommentModel';
import { commentsQueryRepository } from '../../../repositories/commentsQueryRepository';


export const createCommentForPostController = async (req: Request<{ postId: string }, CommentViewModel | ErrorResultModel, CommentInputModel>, res: Response<CommentViewModel | ErrorResultModel>) => {
  try {
    const { postId } = req.params;
    const post = await postsQueryRepository.findPost(postId);
    if (!post) {
      return res.status(404).json({
        errorsMessages: [{ message: 'Post not found', field: 'postId' }]
      });
    }
    const newCommentId = await postsService.createCommentForPost(req.params.postId, req.body, req.user)
    const comment = await commentsQueryRepository.findComment(newCommentId)
    return comment && res
      .status(201)
      .json(comment)
  } catch (error) {
    console.error('Error in createCommentForPostController:', error);
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};