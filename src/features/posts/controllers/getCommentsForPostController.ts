import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { PaginatorCommentViewModel } from '../../../models/QueryModel';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { jwtService } from '../../../application/jwtService';


export const getCommentsForPostController = async (req: Request<{ postId: string }, any, any, any>, res: Response<PaginatorCommentViewModel | ErrorResultModel>) => {
  try {
    const { postId } = req.params;
    // Try to get userId from token if present (for myStatus)
    const userId = await jwtService.getUserIdFromRequest(req);
    
    const post = await postsQueryRepository.findPost(postId)
    if (!post) {
      res.status(404).json({ errorsMessages: [{ message: 'Post not found', field: 'postId' }] })
      return
    }
    const comments = await postsQueryRepository.getComments(req.query, postId, userId ?? undefined)
    return res.status(200).json(comments)

  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};

