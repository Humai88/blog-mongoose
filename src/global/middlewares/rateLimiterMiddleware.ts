import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const createRateLimiter = (endpoint: string) => rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`Rate limit exceeded for ${endpoint}. IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
    });
  },
  keyGenerator: (req: Request) => `${req.ip}:${endpoint}`,
});

export const loginRateLimiter = createRateLimiter('login');
export const registrationRateLimiter = createRateLimiter('registration');
export const registrationConfirmationRateLimiter = createRateLimiter('registration-confirmation');
export const registrationEmailResendingRateLimiter = createRateLimiter('registration-email-resending');
export const passwordRecoveryRateLimiter = createRateLimiter('password-recovery');
export const createNewPasswordRateLimiter = createRateLimiter('new-password');