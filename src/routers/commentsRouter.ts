import {Router} from 'express'
import { commentIdParamValidator, commentValidator, likeStatusValidator } from '../features/comments/middlewares/commentValidator'
import { findCommentController } from '../features/comments/controllers/findCommentController'
import { updateCommentController } from '../features/comments/controllers/updateCommentController'
import { deleteCommentController } from '../features/comments/controllers/deleteCommentController'
import { updateLikeStatusController } from '../features/comments/controllers/updateLikeStatusController'
import { authMiddleware } from '../global/middlewares/authMiddleware'
import { validateObjectId } from '../features/posts/middlewares/postValidator'

export const commentsRouter = Router()
 
commentsRouter.get('/:id', validateObjectId('id'), findCommentController)
commentsRouter.put('/:commentId', commentValidator, commentIdParamValidator, updateCommentController)
commentsRouter.delete('/:commentId', authMiddleware, commentIdParamValidator, deleteCommentController)
commentsRouter.put('/:commentId/like-status', likeStatusValidator, commentIdParamValidator, updateLikeStatusController)