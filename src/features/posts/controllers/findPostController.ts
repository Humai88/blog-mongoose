import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { PostViewModel } from '../../../models/PostModel';
import { ParamModel } from '../../../models/QueryModel';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { jwtService } from '../../../application/jwtService';


export const findPostController = async (req: Request<ParamModel>, res: Response<PostViewModel | ErrorResultModel>) => {
  try {
    const { id } = req.params;
    // Try to get userId from token if present (for myStatus)
    const userId = await jwtService.getUserIdFromRequest(req);
    
    const post = await postsQueryRepository.findPost(id, userId ?? undefined)
    if (!post) {
      res.status(404).json({ errorsMessages: [{ message: 'Post not found', field: 'id' }] })
      return
    }
    return res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
