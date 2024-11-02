import { Response, Request, NextFunction } from "express";
import { QueryPostModel } from "../../../models/QueryModel";
import { setPostQueryDefaultValues } from "../../../helpers/queryDefaultValues";


export const applyPostQueryDefaults = (req: Request<any, any, any, QueryPostModel>, res: Response<any>, next: NextFunction) => {
  req.query = setPostQueryDefaultValues(req.query);
  next();
};