import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { blogsService } from '../../../domains/blogs-service';
import { ParamModel } from '../../../models/QueryModel';


export const deleteBlogController = async (req: Request<ParamModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { id } = req.params;
        const blogToDelete = await blogsService.deleteBlog(id)
        if (!blogToDelete) {
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
