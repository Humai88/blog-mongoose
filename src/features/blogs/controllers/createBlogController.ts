import { Request, Response } from 'express';
import { BlogInputModel } from '../../../models/BlogModel';
import { BlogViewModel } from '../../../models/BlogModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { blogsService } from '../../../domains/blogs-service';
import { blogsQueryRepository } from '../../../repositories/blogsQueryRepository';



export const createBlogController = async (req: Request<any, BlogViewModel, BlogInputModel>, res: Response<BlogViewModel | ErrorResultModel>) => {
      try {
            const newBlogId = await blogsService.createBlog(req.body)
            const blog = await blogsQueryRepository.findBlog(newBlogId)
            return blog && res
                  .status(201)
                  .json(blog)

      } catch (error) {
            return res.status(500).json({
                  errorsMessages: [{ message: 'Internal server error', field: 'server' }]
            });
      }
};

