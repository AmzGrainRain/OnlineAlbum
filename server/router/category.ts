import { Router } from 'express'
import sqlite from 'sqlite'

import { SendResponse } from '../utils'
import { CategorySchema } from './schemas/category'
import type { CategoryT } from '../models/Category'
import type { User } from '../models/User'

import { GetUserDBInstance } from '../utils'

const CategoryRouter = (): Router => {
    const app = Router()

    // 图片分类创建接口
    app.post('/add', CategorySchema['/add'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const categoryName = req.body.name as string
            await db.run('INSERT INTO categories (name) VALUES (?)', categoryName)
            SendResponse(res, {
                success: true,
                message: 'Category created successfully'
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

    // 图片分类删除接口
    app.post('/delete', CategorySchema['/delete'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const categoryId = req.body.id as number
            if (!categoryId) {
                throw new Error('Category id is required')
            }

            await db.run('UPDATE photos SET category_id = 0 WHERE category_id = ?', categoryId)
            await db.run('DELETE FROM categories WHERE id = ?', categoryId)

            SendResponse(res, {
                success: true,
                message: 'Category deleted successfully'
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

    // 图片分类重命名接口
    app.post('/rename', CategorySchema['/rename'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const categoryId = req.body.id as number
            const categoryName = req.body.name as string

            // 更新分类名
            await db.run('UPDATE categories SET name = ? WHERE id = ?', categoryName, categoryId)
            SendResponse(res, {
                success: true,
                message: 'Category renamed successfully',
                data: {
                    id: categoryId,
                    name: categoryName
                }
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

    // 图片分类获取接口
    app.post('/', async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetUserDBInstance(user.id)

            const rows = await db.all<CategoryT[]>(
                'SELECT categories.id, categories.name, count(photos.id) as count, categories.created_at FROM categories LEFT JOIN photos ON categories.id = photos.category_id GROUP BY categories.id'
            )

            SendResponse(res, {
                success: true,
                message: 'Categories query successful',
                data: rows
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

export { CategoryRouter }
