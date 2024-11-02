import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import {DeviceViewModel} from '../../../models/DeviceModel'
import {deviceSessionsQueryRepository} from '../../../repositories/deviceSessionsQueryRepository'
import { jwtService } from '../../../application/jwtService';

export const getActiveSecurityDevicesController = async (req: Request<any>, res: Response<DeviceViewModel[] | ErrorResultModel>) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const verificationResult = await jwtService.verifyRefreshToken(refreshToken);
        const { payload } = verificationResult;
        const sessions = await deviceSessionsQueryRepository.getSessions(payload!.userId)
        return res
          .status(200)
          .json(sessions)

    } catch (error) {
        return res.status(500).json({
            errorsMessages: [{ message: 'Internal server error', field: 'server' }]
        });
    }

};
