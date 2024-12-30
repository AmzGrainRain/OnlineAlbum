import { Response, Request, NextFunction } from 'express'
import { STATIC_DIR } from '../config'

export const VueSinglePageApplication = (req: Request, res: Response, _: NextFunction) => {
    res.sendFile(STATIC_DIR + '/index.html')
}
