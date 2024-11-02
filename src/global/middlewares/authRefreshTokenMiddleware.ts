import { Request, Response, NextFunction, RequestHandler } from 'express';
import { jwtService } from '../../application/jwtService';
import { usersQueryRepository } from '../../repositories/usersQueryRepository';
import jwt from 'jsonwebtoken';
import { deviceSessionsDBRepository } from '../../repositories/deviceSessionsDBRepository';

export const authRefreshTokenMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      errorsMessages: [{ message: 'No refresh token provided', field: 'refreshToken' }]
    });
  }

  try {

    const verificationResult = await jwtService.verifyRefreshToken(refreshToken);

    if (!verificationResult.isValid) {
      if (verificationResult.isExpired) {
        return res.status(401).json({
          errorsMessages: [{ message: 'Refresh token has expired', field: 'refreshToken' }]
        });
      }
      return res.status(401).json({
        errorsMessages: [{ message: 'Invalid refresh token', field: 'refreshToken' }]
      });
    }

    const { payload } = verificationResult;

    if (!payload?.userId || !payload?.deviceId) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Invalid token payload', field: 'refreshToken' }]
      });
    }

    const session = await deviceSessionsDBRepository.findSessionByDeviceId(payload.deviceId);
    if (!session) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Session not found', field: 'deviceId' }]
      });
    }

    if (session.iat !== payload.iat) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Invalid refresh token', field: 'refreshToken' }]
      });
    }

    const user = await usersQueryRepository.findUser(payload.userId);
    if (!user) {
      return res.status(401).json({
        errorsMessages: [{ message: 'User not found', field: 'user' }]
      });
    }

    req.user = user;
    next();
    return
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Refresh token expired', field: 'refreshToken' }]
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Invalid refresh token', field: 'refreshToken' }]
      });
    } else {
      return res.status(500).json({
        errorsMessages: [{ message: 'Internal server error', field: 'server' }]
      });
    }
  }
};