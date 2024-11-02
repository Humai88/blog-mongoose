import {Router} from 'express'
import { deleteAllDataController } from '../features/testing/deleteAllDataController'


export const testRouter = Router()
 
testRouter.delete('/', deleteAllDataController)