import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { PasswordRecoveryInputModel } from '../../../models/UserModel';
import { authService } from '../../../domains/auth-service';


export const passwordRecoveryController = async (req: Request<any, any, PasswordRecoveryInputModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { email } = req.body
        const result = await authService.passwordRecovery(email)
        if (!result) {
            res.status(400).json({ errorsMessages: [{ message: 'Password recovery failed', field: 'email' }] })
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