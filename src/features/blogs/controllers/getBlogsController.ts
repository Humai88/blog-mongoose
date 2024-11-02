import { Request, Response } from 'express';
import { blogsQueryRepository } from '../../../repositories/blogsQueryRepository';
import { PaginatorBlogViewModel, QueryBlogModel } from '../../../models/QueryModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';


export const getBlogsController = async (req: Request<any, any, any, QueryBlogModel>, res: Response<PaginatorBlogViewModel | ErrorResultModel>) => {
  try {
    const blogs = await blogsQueryRepository.getBlogs(req.query)
    return res
      .status(200)
      .json(blogs)

  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
