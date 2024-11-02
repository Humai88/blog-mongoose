import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { authService } from '../../../domains/auth-service';
import { UserInputModel, UserViewModel } from '../../../models/UserModel';
import { usersDBRepository } from '../../../repositories/usersDBRepository';


export const registrationController = async (req: Request<any, UserViewModel, UserInputModel>, res: Response<UserViewModel | ErrorResultModel>) => {
      try {
            const { login, email } = req.body;
            const existingUser = await usersDBRepository.doesExistByLoginOrEmail(login, email)
            if (existingUser) {
                  const field = existingUser.login === login ? 'login' : 'email';
                  return res.status(400).json({
                        errorsMessages: [{ message: `${field} is already taken`, field }]
                  });
            }
            const newUser = await authService.registerUser(req.body)
            return newUser && res
                  .sendStatus(204)

      } catch (error) {
            return res.status(500).json({
                  errorsMessages: [{ message: 'Internal server error', field: 'server' }]
            });
      }
};
