import { Response, Request, NextFunction } from "express";
import {  QueryUserModel } from "../../../models/QueryModel";
import { setUserQueryDefaultValues } from "../../../helpers/queryDefaultValues";


export const applyCommentQueryDefaults = (req: Request<any, any, any, QueryUserModel>, res: Response<any>, next: NextFunction) => {
  req.query = setUserQueryDefaultValues(req.query);
  next();
};