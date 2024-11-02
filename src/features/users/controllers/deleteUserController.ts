import { Request, Response } from 'express';
import { ErrorResultModel } from '../../../models/ErrorResultModel';
import { ParamModel } from '../../../models/QueryModel';
import { usersService } from '../../../domains/users-service';


export const deleteUserController = async (req: Request<ParamModel>, res: Response<null | ErrorResultModel>) => {
    try {
        const { id } = req.params
        const userToDelete = await usersService.deleteUser(id)
        if (!userToDelete) {
            return res.status(404).json({ errorsMessages: [{ message: 'User not found', field: 'id' }] })
        }
        return res
            .sendStatus(204)

    } catch (error) {
        return res.status(500).json({
            errorsMessages: [{ message: 'Internal server error', field: 'server' }]
        });
    }

};
