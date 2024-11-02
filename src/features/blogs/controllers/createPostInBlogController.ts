import { Request, Response } from 'express';
import { PostInBlogInputModel } from '../../../models/BlogModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { blogsService } from '../../../domains/blogs-service';
import { PostViewModel } from '../../../models/PostModel';
import { blogsQueryRepository } from '../../../repositories/blogsQueryRepository';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';


export const createPostInBlogController = async (req: Request<{blogId: string}, PostViewModel, PostInBlogInputModel>, res: Response<PostViewModel | ErrorResultModel>) => {
      try {
        const { blogId } = req.params
        const blog = await blogsQueryRepository.findBlog(blogId)
        if (!blog) {
          res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'blogId' }] })
          return
        }
      const newPostId = await blogsService.createPostInBlog(blogId, req.body)
      const post = await postsQueryRepository.findPost(newPostId)
       return post && res
            .status(201)
            .json(post)
      
                
      } catch (error) {
          return res.status(500).json({
              errorsMessages: [{ message: 'Internal server error', field: 'server' }]
            });
      }

};



