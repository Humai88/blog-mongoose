import {Router} from 'express'
import { authRefreshTokenMiddleware } from '../global/middlewares/authRefreshTokenMiddleware'
import {getActiveSecurityDevicesController} from '../features/security-devices/controllers/getActiveSecurityDevicesController'
import {terminateAllDevicesSessionsController} from '../features/security-devices/controllers/terminateAllDevicesSessionsController'
import {terminateSpecificDeviceSessionController} from '../features/security-devices/controllers/terminateSpecificDeviceSessionController'

export const securityDevicesRouter = Router()
 
securityDevicesRouter.get('/', authRefreshTokenMiddleware, getActiveSecurityDevicesController)
securityDevicesRouter.delete('/', authRefreshTokenMiddleware, terminateAllDevicesSessionsController)
securityDevicesRouter.delete('/:deviceId', authRefreshTokenMiddleware, terminateSpecificDeviceSessionController)