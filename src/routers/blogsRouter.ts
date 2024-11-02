import {Router} from 'express'
import { getBlogsController } from '../features/blogs/controllers/getBlogsController'
import { createBlogController } from '../features/blogs/controllers/createBlogController'
import { findBlogController } from '../features/blogs/controllers/findBlogController'
import { deleteBlogController } from '../features/blogs/controllers/deleteBlogController'
import { updateBlogController } from '../features/blogs/controllers/updateBlogController'
import { blogQueryValidator, blogValidator  } from '../features/blogs/middlewares/blogValidator'
import { adminMiddleware } from '../global/middlewares/adminMiddleware'
import { createPostInBlogController } from '../features/blogs/controllers/createPostInBlogController'
import { getPostsInBlogController } from '../features/blogs/controllers/getPostsInBlogController'
import { applyBlogQueryDefaults } from '../features/blogs/middlewares/blogDefaultQueryValues'
import { blogIdParamValidator, postInBlogValidator, postQueryValidator } from '../features/posts/middlewares/postValidator'
import { applyPostQueryDefaults } from '../features/posts/middlewares/postDefaultQueryValues'

export const blogsRouter = Router()
 
blogsRouter.get('/', applyBlogQueryDefaults, [...blogQueryValidator], getBlogsController)
blogsRouter.get('/:id', findBlogController)
blogsRouter.get('/:blogId/posts', applyPostQueryDefaults, ...blogIdParamValidator, [...postQueryValidator], getPostsInBlogController)
blogsRouter.post('/', ...blogValidator, createBlogController)
blogsRouter.delete('/:id', adminMiddleware, deleteBlogController)
blogsRouter.put('/:id', ...blogValidator, updateBlogController)
blogsRouter.post('/:blogId/posts', ...blogIdParamValidator, ...postInBlogValidator, createPostInBlogController)