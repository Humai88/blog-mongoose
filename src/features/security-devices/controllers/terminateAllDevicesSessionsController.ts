import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { authService } from '../../../domains/auth-service';
import { jwtService } from '../../../application/jwtService';

export const terminateAllDevicesSessionsController = async (req: Request<any>, res: Response<null | ErrorResultModel>) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const verificationResult = await jwtService.verifyRefreshToken(refreshToken);
    const { payload } = verificationResult;
    await authService.removeOtherDeviceSessions(payload!.deviceId);
    return res.sendStatus(204);

  } catch (error) {
    return res.status(500).json({
      errorsMessages: [{ message: 'Internal server error', field: 'server' }]
    });
  }

};


