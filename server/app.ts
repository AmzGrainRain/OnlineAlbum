import fs from 'fs-extra'
import express from 'express'
import 'express-session'

declare module 'express-session' {
    interface SessionData {
        user: User
    }
}

import compression from 'compression'
import morgan from 'morgan'
import upload from 'express-fileupload'
import session from 'express-session'
import * as rfs from 'rotating-file-stream'
import { StaticResouceAccessController } from './middleware/StaticResouceAccessController'
import { RequireLogin } from './middleware/RequireLogin'
import { VueSinglePageApplication } from './middleware/VueSinglePageApplication'

import { AuthRouter } from './router/auth'
import { PhotoRouter } from './router/photo'
import { CategoryRouter } from './router/category'
import { MaintenanceRouter } from './router/maintenance'

import * as conf from './config'
import type { User } from './models/User'
import { InitAccountDB, SendResponse } from './utils'

async function Main() {
    try {
        console.info('Ensuring necessary directory...')
        fs.ensureDirSync(conf.STATIC_DIR)
        fs.ensureDirSync(conf.LOG_DIR)
        fs.ensureDirSync(conf.UPLOAD_TMP_DIR)
        fs.ensureDirSync(conf.PHOTO_ROOT_DIR)
        fs.ensureDirSync(conf.DB_DIR)

        console.info('Initializing database...')
        await InitAccountDB()

        console.info('Setting up middleware...')
        const app = express()
        app.use(morgan('combined', { stream: rfs.createStream('access.log', conf.LOG_RFS_OPTIONS) }))
        app.use(session(conf.SESSION_CONFIG))
        app.use(upload(conf.FILE_UPLOAD_CONFIG))
        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
        app.use(compression())
        app.use('/view/*', VueSinglePageApplication)
        app.use('/photos/:uid/*', StaticResouceAccessController)
        app.use('/', express.static(conf.STATIC_DIR))
        app.use('/api/auth', AuthRouter())
        app.use('/api/photo', RequireLogin, PhotoRouter())
        app.use('/api/category', RequireLogin, CategoryRouter())
        app.use('/api/maintenance', RequireLogin, MaintenanceRouter())
        app.use((err: Error, _: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err)
            res.status(500)
            SendResponse(res, {
                success: false,
                message: 'Internal Server Error'
            })
            next()
        })
        app.listen(conf.PORT)
        console.info(`Server is running on http://localhost:${conf.PORT}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

Main()
