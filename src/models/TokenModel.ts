export type RefreshTokenPayload = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
  jti?: string;
  type: 'refresh';
  version?: number;
  aud?: string;  
}

export type TokenVerificationResult = {
  isValid: boolean;
  isExpired: boolean;
  payload: RefreshTokenPayload | null;
};