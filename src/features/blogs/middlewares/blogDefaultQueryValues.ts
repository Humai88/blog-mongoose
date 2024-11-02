import { Response, Request, NextFunction } from "express";
import { QueryBlogModel } from "../../../models/QueryModel";
import { setBlogQueryDefaultValues } from "../../../helpers/queryDefaultValues";


export const applyBlogQueryDefaults = (req: Request<any, any, any, QueryBlogModel>, res: Response<any>, next: NextFunction) => {
  req.query = setBlogQueryDefaultValues(req.query);
  next();
};