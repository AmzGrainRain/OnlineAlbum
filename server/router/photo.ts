import path from 'path'
import fs from 'fs-extra'
import { Router } from 'express'
import sharp from 'sharp'
import sqlite from 'sqlite'

import { SendResponse, GenerateUniqueString, JoinPhotoPath, JoinThumbnailPath, GetUserDBInstance } from '../utils'
import { PhotoSchema } from './schemas/photos'
import type { PhotoT } from '../models/Photo'
import type { User } from '../models/User'

const PhotoRouter = (): Router => {
    const app = Router()

    // 图片上传接口
    app.post('/upload', async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const photos = req.files?.photos
            if (!photos) {
                throw new Error('No photos found')
            }

            const photoDir = JoinPhotoPath(user.id, '')
            const thumbnailDir = JoinThumbnailPath(user.id, '')
            await fs.ensureDir(photoDir)
            await fs.ensureDir(thumbnailDir)

            const uploaded: string[] = []
            for (const photo of Array.isArray(photos) ? photos : [photos]) {
                const fileName = GenerateUniqueString() + path.extname(photo.name)
                const filePath = path.join(photoDir, fileName)
                const thumbnailPath = path.join(thumbnailDir, fileName)

                try {
                    const metadata = await sharp(photo.tempFilePath).metadata()
                    if (!metadata.width || !metadata.height) {
                        throw new Error('Invalid image file')
                    }

                    await sharp(photo.tempFilePath)
                        .jpeg({ quality: 70 })
                        .resize({ width: Math.floor(metadata.width * 0.6) })
                        .toFile(thumbnailPath)
                    await photo.mv(filePath)

                    const landscape = metadata.width > metadata.height
                    if (metadata.width != metadata.height)
                        await db.run(
                            'INSERT INTO photos (width, height, landscape, file_name) VALUES (?,?,?,?)',
                            metadata.width,
                            metadata.height,
                            landscape,
                            fileName
                        )
                    else await db.run('INSERT INTO photos (width, height, file_name) VALUES (?,?,?)', metadata.width, metadata.height, fileName)

                    uploaded.push(fileName)
                } catch (error) {
                    console.error(error)
                    await fs.remove(filePath)
                    await fs.remove(thumbnailPath)
                    await db.run('DELETE FROM photos WHERE file_name = ?', fileName)
                }
            }

            SendResponse(res, {
                success: true,
                message: 'All files uploaded successfully',
                data: uploaded
            })
        } catch (error) {
            console.error(error)
            SendResponse(res, {
                success: false,
                message: String(error)
            })
        } finally {
            if (db) db.close()
        }
    })

    // 图片删除接口
    app.post('/delete', PhotoSchema['/delete'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const indexes = req.body.indexes as string[]
            const inList = indexes.join(',')
            const photos = await db.all<{ id: number; file_name: string }[]>(`SELECT id, file_name FROM photos WHERE id IN (${inList})`)
            await db.run(`DELETE FROM photos WHERE id IN (${inList})`)
            for (const photo of photos) {
                await fs.remove(JoinPhotoPath(user.id, photo.file_name))
                await fs.remove(JoinThumbnailPath(user.id, photo.file_name))
            }

            SendResponse(res, {
                success: true,
                message: 'One or more photos deleted successfully',
                data: indexes
            })
        } catch (error) {
            console.error(error)
            SendResponse(res, {
                success: false,
                message: String(error)
            })
        } finally {
            if (db) db.close()
        }
    })

    // 图片列表接口
    app.post('/list/:category(\\d+)/:limit(\\d+)/:page(\\d+)', PhotoSchema['/list'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const category = parseInt(req.params.category)
            const limit = parseInt(req.params.limit)
            const page = parseInt(req.params.page) - 1

            const offset = page * limit
            const photos = await db.all<PhotoT[]>('SELECT * FROM photos WHERE category_id = ? LIMIT ? OFFSET ?', category, limit, offset)
            const queryResult = (await db.get<{ total: number }>('SELECT COUNT(*) as total FROM photos WHERE category_id = ?', category)) || { total: 0 }

            SendResponse(res, {
                success: true,
                data: {
                    photos,
                    total: queryResult.total
                },
                message: 'Photos list fetched successfully'
            })
        } catch (error) {
            console.error(error)
            SendResponse(res, {
                success: false,
                message: String(error)
            })
        } finally {
            if (db) db.close()
        }
    })

    // 图片分类接口
    app.post('/change-category', PhotoSchema['/change-category'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const { indexes, category } = req.body
            const inList = indexes.join(',')
            await db.run(`UPDATE photos SET category_id = ? WHERE id IN (${inList})`, category)

            SendResponse(res, {
                success: true,
                message: 'Photo category changed successfully'
            })
        } catch (error) {
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

export { PhotoRouter }
