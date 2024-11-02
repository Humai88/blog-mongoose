import {Router} from 'express'
import { loginController } from '../features/users/controllers/loginController'
import { getUserInfoController } from '../features/users/controllers/getUserInfoController'
import { authMiddleware } from '../global/middlewares/authMiddleware'
import { authRefreshTokenMiddleware } from '../global/middlewares/authRefreshTokenMiddleware'
import { registrationController } from '../features/users/controllers/registrationController'
import { registrationConfirmationController } from '../features/users/controllers/registrationConfirmationController'
import { registrationEmailResendingController } from '../features/users/controllers/registrationEmailResendingController'
import { refreshTokensController } from '../features/users/controllers/refreshTokensController'
import { logoutController } from '../features/users/controllers/logoutController'
import { userValidator, emailValidator, userConfirmationValidator, passwordRecoveryValidator } from '../features/users/middlewares/userValidator'
import {loginRateLimiter, registrationRateLimiter, registrationConfirmationRateLimiter, registrationEmailResendingRateLimiter, passwordRecoveryRateLimiter, createNewPasswordRateLimiter} from '../global/middlewares/rateLimiterMiddleware'
import {passwordRecoveryController} from '../features/users/controllers/passwordRecoveryController'
import {createNewPasswordController} from '../features/users/controllers/createNewPasswordController'


export const authRouter = Router()
 
authRouter.post('/login', loginRateLimiter, loginController)
authRouter.get('/me', authMiddleware, getUserInfoController)
authRouter.post('/registration', registrationRateLimiter, ...userValidator, registrationController)
authRouter.post('/registration-confirmation', registrationConfirmationRateLimiter, userConfirmationValidator, registrationConfirmationController)
authRouter.post('/registration-email-resending', registrationEmailResendingRateLimiter, emailValidator, registrationEmailResendingController)
authRouter.post('/refresh-token', authRefreshTokenMiddleware, refreshTokensController)
authRouter.post('/logout', authRefreshTokenMiddleware, logoutController)
authRouter.post('/password-recovery', passwordRecoveryRateLimiter, emailValidator, passwordRecoveryController)
authRouter.post('/new-password', createNewPasswordRateLimiter, passwordRecoveryValidator, createNewPasswordController)


