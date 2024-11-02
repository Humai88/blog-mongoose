import { Request, Response } from 'express';
import { commentsQueryRepository } from '../../../repositories/commentsQueryRepository';
import { CommentViewModel } from '../../../models/CommentModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';


export const findCommentController = async (req: Request<{ id: string }, CommentViewModel, any, any>, res: Response<CommentViewModel | ErrorResultModel>) => {
  try {
    const { id } = req.params;
    const comment = await commentsQueryRepository.findComment(id)
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
