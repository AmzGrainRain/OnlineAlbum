import type { User } from '../models/User'

import { Router } from 'express'
import sqlite from 'sqlite'
import fs from 'fs-extra'

import { RequireLogin } from '../middleware/RequireLogin'

import { AuthSchema } from './schemas/auth'
import { GenerateUserDB, GetAccountDBInstance, RemoveUserDB, RemoveUserUploads, SendResponse } from '../utils'

const AuthRouter = (): Router => {
    const app = Router()

    app.get('/', (req, res) => {
        if (!req.session.user) {
            SendResponse(res, {
                success: false,
                message: 'You are not logged in'
            })
            return
        }

        SendResponse(res, {
            success: true,
            message: 'You are logged in',
            data: req.session.user
        })
    })

    app.post('/list', RequireLogin, AuthSchema['/list'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetAccountDBInstance()

            if (user.is_admin !== 1) {
                throw new Error('You are not authorized to perform this action')
            }

            const users = await db.all<User[]>('SELECT * FROM users')
            if (!users) {
                throw new Error('Failed to fetch users')
            }

            SendResponse(res, {
                success: true,
                message: 'Users fetched successfully',
                data: users
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

    app.post('/login', AuthSchema['/login'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            db = await GetAccountDBInstance()
            const { email, password } = req.body

            const accountInfo = await db.get<User>('SELECT id, name, email, is_admin, created_at FROM users WHERE email = ? AND password = ?', email, password)
            if (!accountInfo) {
                throw new Error('Invalid email or password')
            }

            req.session.user = accountInfo
            SendResponse(res, {
                success: true,
                message: 'Login successful',
                data: accountInfo
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

    app.post('/regist', RequireLogin, AuthSchema['/regist'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetAccountDBInstance()

            if (user.is_admin !== 1) {
                throw new Error('You are not authorized to perform this action')
            }

            const { name, email, password } = req.body

            // 创建用户
            {
                const result = await db.run('INSERT INTO users(name, email, password, is_admin) VALUES (?,?,?,0)', name, email, password)
                if (result.changes !== 1) {
                    throw new Error('Failed to create user')
                }
            }

            // 创建用户数据库
            {
                const result = await db.get<{id: number}>('SELECT id FROM users WHERE email = ?', email)
                if (!result) {
                    throw new Error('Failed to create user')
                }
                await GenerateUserDB(result.id)
            }

            SendResponse(res, {
                success: true,
                message: 'User created successfully',
                data: req.body
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

    app.post('/rename', RequireLogin, AuthSchema['/rename'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetAccountDBInstance()

            if (user.is_admin !== 1) {
                throw new Error('You are not authorized to perform this action')
            }

            const { id, name } = req.body
            const result = await db.run('UPDATE users SET name = ? WHERE id = ?', name, id)
            if (result.changes !== 1) {
                throw new Error('Failed to update user')
            }

            SendResponse(res, {
                success: true,
                message: 'User updated successfully',
                data: req.body
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

    app.post('/delete', RequireLogin, AuthSchema['/delete'], async (req, res) => {
        let db: sqlite.Database | null = null

        try {
            const user = req.session.user as User
            db = await GetAccountDBInstance()

            if (user.is_admin !== 1) {
                throw new Error('You are not authorized to perform this action')
            }

            const { id } = req.body
            const accountInfo = await db.get<User>('SELECT * FROM users WHERE id = ?', id)
            if (!accountInfo) {
                throw new Error('User not found')
            }
            if (accountInfo.is_admin === 1) {
                throw new Error('You cannot delete an admin user')
            }

            const result = await db.run('DELETE FROM users WHERE id = ?', id)
            if (result.changes !== 1) {
                throw new Error('Failed to delete user')
            }
            await RemoveUserDB(accountInfo.id)
            await RemoveUserUploads(accountInfo.id)

            SendResponse(res, {
                success: true,
                message: 'User deleted successfully',
                data: req.body
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

    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error(err)
                SendResponse(res, {
                    success: false,
                    message: 'Failed to logout'
                })
                return
            }

            SendResponse(res, {
                success: true,
                message: 'Logout successful'
            })
        })
    })

    return app
}

export { AuthRouter }
