import { Router } from 'express'
import fs from 'fs-extra'
import sqlite from 'sqlite'

import { SendResponse, GetUserDBInstance, JoinPhotoPath, JoinThumbnailPath } from '../utils'
import type { User } from '../models/User'

const MaintenanceRouter = (): Router => {
    const app = Router()

    // 图片数据统计
    app.post('/count', async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const metadata = await db.get<{total: number}>('SELECT COUNT(id) as total FROM photos')
            if (!metadata) {
                throw new Error('No photos found')
            }

            const photoDir = await fs.readdir(JoinPhotoPath(user.id, ''))
            const thumbnailDir = await fs.readdir(JoinThumbnailPath(user.id, ''))

            SendResponse(res, {
                success: true,
                message: 'count fetched successfully',
                data: {
                    total: metadata.total,
                    photoCount: photoDir.length - 1,
                    thumbnailCount: thumbnailDir.length
                }
            })
        }
        catch (error) {
            console.error(error)
            SendResponse(res, {
                success: false,
                message: String(error)
            })
        } finally {
            if (db) db.close()
        }
    })

    return app
}

export { MaintenanceRouter }
