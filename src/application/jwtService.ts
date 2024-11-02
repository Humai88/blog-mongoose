import jwt from "jsonwebtoken"
import { SETTINGS } from "../settings";
import { ObjectId } from "mongodb";
import {RefreshTokenPayload} from "../models/TokenModel"
import {TokenVerificationResult} from "../models/TokenModel"
import { TokenExpiredError } from 'jsonwebtoken';

export const jwtService = {
  async generateToken(userId: string): Promise<any> {
    const token = jwt.sign({ userId: userId }, SETTINGS.JWT_SECRET, { expiresIn: '10s' });
    return {
      accessToken: token
    }
  },

  async generateRefreshToken(userId: string, deviceId: string): Promise<string> {
    const refreshToken = jwt.sign({ userId: userId, deviceId: deviceId }, SETTINGS.REFRESH_TOKEN_SECRET, { expiresIn: '20s' });
    return refreshToken
  },

  async verifyRefreshToken(token: string): Promise<TokenVerificationResult> {
    try {
      const decoded = jwt.verify(token, SETTINGS.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
      
      if (!decoded.userId || !decoded.deviceId) {
        return { isValid: false, isExpired: false, payload: null };
      }
      return { isValid: true, isExpired: false, payload: decoded };
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      if (error instanceof TokenExpiredError) {
        return { isValid: false, isExpired: true, payload: null };
      }
      return { isValid: false, isExpired: false, payload: null };
    }
  },

  async getUserIdByToken(token: string): Promise<any> {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      return new ObjectId(result.userId)
    } catch (error) {
      return null
    }
  }
}