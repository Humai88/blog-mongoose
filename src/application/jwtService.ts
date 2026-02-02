import jwt, { TokenExpiredError } from "jsonwebtoken"
import { SETTINGS } from "../settings";
import { ObjectId } from "mongodb";
import {RefreshTokenPayload, TokenVerificationResult} from "../models/TokenModel"
import { Request } from "express";

export const jwtService = {
  async generateToken(userId: string): Promise<any> {
    const token = jwt.sign({ userId: userId }, SETTINGS.JWT_SECRET, { expiresIn: '10m' });
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
  },

  /**
   * Extracts userId from Authorization header if valid token is present.
   * Returns null if no token or invalid token - does not throw.
   */
  async getUserIdFromRequest(req: Request): Promise<string | null> {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader) return null;

      const [bearer, token] = authHeader.split(' ');
      if (bearer !== 'Bearer' || !token) return null;

      const userId = await this.getUserIdByToken(token);
      return userId ? userId.toString() : null;
    } catch (error) {
      return null;
    }
  }
}