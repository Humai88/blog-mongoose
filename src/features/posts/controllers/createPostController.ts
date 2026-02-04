import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { PostInputModel } from '../../../models/PostModel';
import { PostViewModel } from '../../../models/PostModel';
import { postsService } from '../../../domains/posts-service';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';
import { jwtService } from '../../../application/jwtService';


export const createPostController = async (req: Request<any, PostViewModel | ErrorResultModel, PostInputModel>, res: Response<PostViewModel | ErrorResultModel>) => {
  try {
    const newPostId = await postsService.createPost(req.body);
    // Try to get userId from token if present (for myStatus)
    const userId = await jwtService.getUserIdFromRequest(req);
    const post = await postsQueryRepository.findPost(newPostId, userId ?? undefined);
    return post && res.status(201).json(post);
  } catch (error) {
    console.error('Error in createPostController:', error);
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
