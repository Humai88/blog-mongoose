import express from 'express'
import cors from 'cors'
import { SETTINGS } from './settings'
import { testRouter } from './routers/testingRouter'
import { postsRouter } from './routers/postsRouter'
import { blogsRouter } from './routers/blogsRouter'
import { usersRouter } from './routers/usersRouter'
import { authRouter } from './routers/authRouter'
import { commentsRouter } from './routers/commentsRouter'
import {securityDevicesRouter} from './routers/securityDevicesRouter'
import cookieParser from 'cookie-parser';
 
export const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.set('trust proxy', true)
 
app.get('/', (req, res) => {
    res.status(200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.SECURITY_DEVICES, securityDevicesRouter)
app.use(SETTINGS.PATH.TEST, testRouter)