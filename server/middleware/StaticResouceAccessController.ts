import { Response, Request, NextFunction } from 'express'
import { SendResponse } from '../utils'

export const StaticResouceAccessController = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user) {
        SendResponse(res, {
            success: false,
            message: 'Unauthorized'
        })
        return
    }

    if (req.session.user.id.toString() !== req.params.uid) {
        SendResponse(res, {
            success: false,
            message: 'You are not authorized to access this resource'
        })
        return
    }

    next()
}
