import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { PaginatorPostViewModel } from '../../../models/QueryModel';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { blogsQueryRepository } from '../../../repositories/blogsQueryRepository';
import { jwtService } from '../../../application/jwtService';


export const getPostsInBlogController = async (req: Request<{blogId: string}, any, any, any>, res: Response<PaginatorPostViewModel | ErrorResultModel>) => {
  try {
    const {blogId} = req.params
    const blog = await blogsQueryRepository.findBlog(blogId)
    if (!blog) {
      res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'blogId' }] })
      return
    }
    // Try to get userId from token if present (for myStatus)
    const userId = await jwtService.getUserIdFromRequest(req);
    
    const posts = await postsQueryRepository.getPosts(req.query, blogId, userId ?? undefined)
    return res.status(200).json(posts)
                
  } catch (error) {
      return res.status(500).json({
          errorsMessages: [{ message: 'Internal server error', field: 'server' }]
        });
  }

};

