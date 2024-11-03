import { Request, Response } from 'express'
import { commentsCollection, postsCollection, usersCollection, deviceSessionsCollection } from '../../db/mongo-db';
import { BlogModel } from '../../models/blog-model';

export const deleteAllDataController = async (req: Request, res: Response): Promise<any> => {
  try {
    await BlogModel.deleteMany({});
    await postsCollection.deleteMany({});
    await usersCollection.deleteMany({});
    await commentsCollection.deleteMany({});
    await deviceSessionsCollection.deleteMany({});
    return res
      .sendStatus(204)
  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }

}
