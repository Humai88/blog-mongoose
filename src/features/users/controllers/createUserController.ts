import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { usersService } from '../../../domains/users-service';
import { UserInputModel, UserViewModel } from '../../../models/UserModel';
import { usersQueryRepository } from '../../../repositories/usersQueryRepository';
import { usersDBRepository } from '../../../repositories/usersDBRepository';


export const createUserController = async (req: Request<any, UserViewModel, UserInputModel>, res: Response<UserViewModel | ErrorResultModel>) => {
      try {
            const { login, email } = req.body;
            const existingUser  = await usersDBRepository.doesExistByLoginOrEmail(login, email)
            if (existingUser) {
                  const field = existingUser.login === login ? 'login' : 'email';
                  return res.status(400).json({ 
                    errorsMessages: [{ message: `${field} is already taken`, field }] 
                  });
                }
            const newUserId = await usersService.createUser(req.body)
            const user = await usersQueryRepository.findUser(newUserId)
            return user && res
                  .status(201)
                  .json(user)

      } catch (error) {
            return res.status(500).json({
                  errorsMessages: [{ message: 'Internal server error', field: 'server' }]
            });
      }
};

