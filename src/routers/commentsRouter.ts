import {Router} from 'express'
import { commentIdParamValidator, commentValidator } from '../features/comments/middlewares/commentValidator'
import { findCommentController } from '../features/comments/controllers/findCommentController'
import { updateCommentController } from '../features/comments/controllers/updateCommentController'
import { deleteCommentController } from '../features/comments/controllers/deleteCommentController'
import { authMiddleware } from '../global/middlewares/authMiddleware'

export const commentsRouter = Router()
 
commentsRouter.get('/:id', findCommentController)
commentsRouter.put('/:commentId', commentValidator, commentIdParamValidator, updateCommentController)
commentsRouter.delete('/:commentId', authMiddleware, commentIdParamValidator, deleteCommentController)