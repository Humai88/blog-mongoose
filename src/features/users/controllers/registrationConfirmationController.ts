import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { RegistrationConfirmationCodeModel } from '../../../models/UserModel';
import { authService } from '../../../domains/auth-service';


export const registrationConfirmationController = async (req: Request<any, any, RegistrationConfirmationCodeModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { code } = req.body
        const result = await authService.confirmRegistration(code)
        if (!result) {
            res.status(400).json({ errorsMessages: [{ message: 'Email confirmation failed', field: 'code' }] })
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