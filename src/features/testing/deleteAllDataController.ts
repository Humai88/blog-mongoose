import { Request, Response } from 'express'
import { BlogModel } from '../../models/blog-model';
import { PostModel } from '../../models/post-model';
import { CommentModel } from '../../models/comment-model';
import { UserModel } from '../../models/user-model';
import { DeviceModel } from '../../models/device-model';
import { CommentLikeModel } from '../../models/comment-like-model';
import { PostLikeModel } from '../../models/post-like-model';

export const deleteAllDataController = async (req: Request, res: Response): Promise<any> => {
  try {
    await BlogModel.deleteMany({});
    await PostModel.deleteMany({});
    await UserModel.deleteMany({});
    await CommentModel.deleteMany({});
    await DeviceModel.deleteMany({});
    await CommentLikeModel.deleteMany({});
    await PostLikeModel.deleteMany({});
    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }

}
