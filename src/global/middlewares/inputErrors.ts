import { Response, Request, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { ErrorResultModel, FieldNamesType } from '../../models/ErrorResultModel'

export const inputErrors = (req: Request, res: Response<ErrorResultModel>, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorsArray = errors.array({ onlyFirstError: true }) as { path: FieldNamesType, msg: string }[]
    const errorResult: ErrorResultModel = {
      errorsMessages: errorsArray.map(error => ({
        message: error.msg,
        field: error.path as FieldNamesType
      }))
    }
     res.status(400).json(errorResult)
     return
  }
  next()
}