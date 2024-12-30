import { RequestHandler, Request, Response, NextFunction } from 'express'
import { SendResponse } from '../utils'

export const RequireLogin: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    if (req.session.user) {
        next()
        return
    }

    SendResponse(res, {
        success: false,
        message: 'Please login first'
    })
}
