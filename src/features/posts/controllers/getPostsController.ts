import { Request, Response } from 'express';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { PaginatorPostViewModel, QueryPostModel } from '../../../models/QueryModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';


export const getPostsController = async (req: Request<any, any, any, QueryPostModel>, res: Response<PaginatorPostViewModel | ErrorResultModel>) => {
  try {
    const posts = await postsQueryRepository.getPosts(req.query)
    return res
      .status(200)
      .json(posts)
  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
