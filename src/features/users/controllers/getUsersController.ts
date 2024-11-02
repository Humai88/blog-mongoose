import { Request, Response } from 'express';
import { PaginatorUserViewModel, QueryUserModel } from '../../../models/QueryModel';
import { usersQueryRepository } from '../../../repositories/usersQueryRepository';
import { ErrorResultModel } from '../../../models/ErrorResultModel';


export const getUsersController = async (req: Request<any, any, any, QueryUserModel>, res: Response<PaginatorUserViewModel | ErrorResultModel>) => {
  try {
    const users = await usersQueryRepository.getUsers(req.query)
    return res
      .status(200)
      .json(users)

  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }
};
