import { Request, Response } from 'express';
import { BlogViewModel } from '../../../models/BlogModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { ParamModel } from '../../../models/QueryModel';
import { blogsQueryRepository } from '../../../repositories/blogsQueryRepository';


export const findBlogController = async (req: Request<ParamModel>, res: Response<BlogViewModel | ErrorResultModel>) => {
  try {
    const {id} = req.params
    const blog = await blogsQueryRepository.findBlog(id)
    if (!blog) {
      res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] })
      return
    }
    return res.status(200).json(blog)
                
  } catch (error) {
      return res.status(500).json({
          errorsMessages: [{ message: 'Internal server error', field: 'server' }]
        });
  }

};
