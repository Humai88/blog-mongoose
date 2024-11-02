import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { RegistrationEmailResendingModel } from '../../../models/UserModel';
import { authService } from '../../../domains/auth-service';


export const registrationEmailResendingController = async (req: Request<any, any, RegistrationEmailResendingModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { email } = req.body
        const result = await authService.resendRegistrationEmail(email)
        if (!result) {
            res.status(400).json({ errorsMessages: [{ message: 'Resending email confirmation failed', field: 'email' }] })
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