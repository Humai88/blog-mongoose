import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { PostViewModel } from '../../../models/PostModel';
import { ParamModel } from '../../../models/QueryModel';
import { postsQueryRepository } from '../../../repositories/postsQueryRepository';


export const findPostController = async (req: Request<ParamModel>, res: Response<PostViewModel | ErrorResultModel>) => {
  try {
    const { id } = req.params;
    const post = await postsQueryRepository.findPost(id)
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
