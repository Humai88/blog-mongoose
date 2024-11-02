import { Request, Response } from 'express';
import { QueryUserModel } from '../../../models/QueryModel';
import { usersQueryRepository } from '../../../repositories/usersQueryRepository';
import { MeViewModel } from '../../../models/UserModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';


export const getUserInfoController = async (req: Request<any, any, any, QueryUserModel>, res: Response<MeViewModel | ErrorResultModel>) => {
  try {
    const me = await usersQueryRepository.getMeInfo(req.user)
    return res
      .status(200)
      .json(me!)

  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }

};
