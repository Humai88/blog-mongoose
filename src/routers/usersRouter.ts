import {Router} from 'express'
import { adminMiddleware } from '../global/middlewares/adminMiddleware'
import { applyUserQueryDefaults } from '../features/users/middlewares/userDefaultQueryValues'
import { userQueryValidator, userValidator } from '../features/users/middlewares/userValidator'
import { getUsersController } from '../features/users/controllers/getUsersController'
import { createUserController } from '../features/users/controllers/createUserController'
import { deleteUserController } from '../features/users/controllers/deleteUserController'

export const usersRouter = Router()
 
usersRouter.get('/', applyUserQueryDefaults, userQueryValidator, getUsersController)
usersRouter.post('/', adminMiddleware, ...userValidator, createUserController)
usersRouter.delete('/:id', adminMiddleware, deleteUserController)