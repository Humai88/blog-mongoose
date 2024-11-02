import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { postsService } from '../../../domains/posts-service';
import { ParamModel } from '../../../models/QueryModel';


export const deletePostController = async (req: Request<ParamModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { id } = req.params;
        const postToDelete = await postsService.deletePost(id)
        if (!postToDelete) {
            res.status(404).json({ errorsMessages: [{ message: 'Post not found', field: 'id' }] })
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
