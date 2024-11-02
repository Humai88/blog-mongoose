import { Request, Response, NextFunction, RequestHandler } from 'express';
import { jwtService } from '../../application/jwtService';
import { usersQueryRepository } from '../../repositories/usersQueryRepository';


export const authMiddleware: RequestHandler<any, any, any, any> = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        errorsMessages: [{ message: 'No authorization header provided', field: 'accessToken' }]  
      }); 
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Invalid authorization header format', field: 'accessToken' }]  
      }); 
    }

    const userId = await jwtService.getUserIdByToken(token);

    if (!userId) {
      return res.status(401).json({
        errorsMessages: [{ message: 'Invalid or expired token', field: 'accessToken' }]  
      }); 
    }

    const user = await usersQueryRepository.findUser(userId);

    if (!user) {
      return res.status(401).json({
        errorsMessages: [{ message: 'User not found', field: 'user' }]  
      }); 
    }

    req.user = user;
    next();
    return
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

