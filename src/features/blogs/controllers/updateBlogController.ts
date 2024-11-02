import { Request, Response } from 'express';
import { BlogViewModel } from '../../../models/BlogModel';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { blogsService } from '../../../domains/blogs-service';
import { ParamModel } from '../../../models/QueryModel';


export const updateBlogController = async (req: Request<ParamModel, null, BlogViewModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { id } = req.params
        const blogToUpdate = await blogsService.updateBlog(id, req.body)
        if (!blogToUpdate) {
            res.status(404).json({ errorsMessages: [{ message: 'Blog not found', field: 'id' }] })
            return
        }
        return res
            .sendStatus(204)

    } catch (error) {
        return res.status(500).json({
            errorsMessages: [{ message: 'Internal server error', field: 'server' }]
        });
    }

};
