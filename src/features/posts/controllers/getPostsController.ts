import { Request, Response } from 'express';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { PaginatorPostViewModel} from '../../../models/QueryModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { jwtService } from '../../../application/jwtService';


export const getPostsController = async (req: Request<any, any, any, any>, res: Response<PaginatorPostViewModel | ErrorResultModel>) => {
  try {
    // Try to get userId from token if present (for myStatus)
    const userId = await jwtService.getUserIdFromRequest(req);
    
    const posts = await postsQueryRepository.getPosts(req.query, undefined, userId ?? undefined)
    return res
      .status(200)
      .json(posts)
  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
