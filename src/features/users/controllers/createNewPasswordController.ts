import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { authService } from '../../../domains/auth-service';
import { NewPasswordRecoveryInputModel } from '../../../models/UserModel';


export const createNewPasswordController = async (req: Request<any, any, NewPasswordRecoveryInputModel>, res: Response<null | ErrorResultModel>) => {
      try {
            const { recoveryCode, newPassword } = req.body
            const result = await authService.createNewPassword(recoveryCode, newPassword)
            if (!result) {
                res.status(400).json({ errorsMessages: [{ message: 'New password creation failed', field: 'recoveryCode' }] })
                return
            }
            return res
                .sendStatus(204)

      } catch (error) {
            return res.status(500).json({
                  errorsMessages: [{ message: 'Internal server error', field: 'server' }]
            });
      }
};
