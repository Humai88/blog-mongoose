import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { jwtService } from '../../../application/jwtService';
import { authService } from '../../../domains/auth-service';
import { LoginSuccessViewModel } from '../../../models/UserModel';

export const refreshTokensController = async (req: Request<any>, res: Response<LoginSuccessViewModel | ErrorResultModel>) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res.status(401).json({
                errorsMessages: [{ message: 'Refresh token is missing', field: 'refreshToken' }]
            });
        }

        const verificationResult = await jwtService.verifyRefreshToken(oldRefreshToken);
        const { payload } = verificationResult;
        const newAccessToken = await jwtService.generateToken(payload!.userId);
        const newRefreshToken = await jwtService.generateRefreshToken(payload!.userId, payload!.deviceId);
        await authService.updateRefreshToken(newRefreshToken);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).send(newAccessToken);

    } catch (error) {
        return res.status(500).json({
            errorsMessages: [{ message: 'Internal server error', field: 'server' }]
        });
    }

};