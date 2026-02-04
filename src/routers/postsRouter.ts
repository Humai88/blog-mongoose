import {Router} from 'express'
import { getPostsController } from '../features/posts/controllers/getPostsController'
import { createPostController } from '../features/posts/controllers/createPostController'
import { findPostController } from '../features/posts/controllers/findPostController'
import { deletePostController } from '../features/posts/controllers/deletePostController'
import { updatePostController } from '../features/posts/controllers/updatePostController'
import { postIdParamValidator, postQueryValidator, postValidator, validateObjectId } from '../features/posts/middlewares/postValidator'
import { adminMiddleware } from '../global/middlewares/adminMiddleware'
import { applyPostQueryDefaults } from '../features/posts/middlewares/postDefaultQueryValues'
import { createCommentForPostController } from '../features/posts/controllers/createCommentForPostController'
import { commentValidator, likeStatusValidator } from '../features/comments/middlewares/commentValidator'
import { getCommentsForPostController } from '../features/posts/controllers/getCommentsForPostController'
import { authMiddleware } from '../global/middlewares/authMiddleware'
import { updateLikeStatusForPostController } from '../features/posts/controllers/updateLikeStatusForPostController'

export const postsRouter = Router()
 
postsRouter.get('/', applyPostQueryDefaults, [...postQueryValidator], getPostsController)
postsRouter.post('/', ...postValidator, createPostController)
postsRouter.get('/:id', findPostController)
postsRouter.delete('/:id', adminMiddleware, deletePostController)
postsRouter.put('/:id', ...postValidator, updatePostController)
postsRouter.post('/:postId/comments', ...commentValidator, createCommentForPostController)
postsRouter.get('/:postId/comments', applyPostQueryDefaults, postIdParamValidator, getCommentsForPostController)
postsRouter.put('/:postId/like-status', authMiddleware, postIdParamValidator, likeStatusValidator, updateLikeStatusForPostController)
