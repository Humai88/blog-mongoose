import { Request, Response } from 'express';
import { commentsQueryRepository } from '../../../repositories/commentsQueryRepository';
import { CommentViewModel } from '../../../models/CommentModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { jwtService } from '../../../application/jwtService';


export const findCommentController = async (req: Request<{ id: string }, CommentViewModel, any, any>, res: Response<CommentViewModel | ErrorResultModel>) => {
  try {
    const { id } = req.params;
    // Try to get userId from token if present (for myStatus)
    const userId = await jwtService.getUserIdFromRequest(req);
    const comment = await commentsQueryRepository.findComment(id, userId ?? undefined)
    if (!comment) {
      res.status(404).json({ errorsMessages: [{ message: 'Comment not found', field: 'id' }] })
      return
    }
    return res.status(200).json(comment)
  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
