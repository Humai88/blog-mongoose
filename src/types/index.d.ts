import { UserViewModel } from './../models/UserModel';

declare global {
  namespace Express {
    export interface Request {
      user: UserViewModel | null
      rateLimit: {
        limit: number;
        current: number;
        remaining: number;
        resetTime: Date;
      }
    }
  }
}