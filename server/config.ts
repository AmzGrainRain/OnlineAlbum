import path from 'path'
import session from 'express-session'
import upload from 'express-fileupload'
import type { AdminUser } from './models/User'

const PORT = 8000

const LOG_DIR = path.resolve(__dirname, 'logs')

const LOG_RFS_OPTIONS = {
    interval: '1d',
    path: LOG_DIR,
    compress: 'gzip'
}

const DB_DIR = path.resolve(__dirname, 'userdata')

const ACCOUNT_DB_INIT_SCRIPT = path.resolve(__dirname, 'sql', 'account_init.sql')
const USER_DB_INIT_SCRIPT = path.resolve(__dirname, 'sql', 'user_init.sql')
const ADMIN_DB_INIT_SCRIPT = path.resolve(__dirname, 'sql', 'admin_init.sql')

const STATIC_DIR = path.resolve(__dirname, 'static')

const UPLOAD_TMP_DIR: string = path.resolve(__dirname, 'tmp')

const PHOTO_ROOT_DIR: string = path.join(STATIC_DIR, 'photos')

const THUMBNAIL_DIR_NAME: string = 'thumbnails'

const SESSION_CONFIG: session.SessionOptions = {
    secret: '!2@3$5%6', // 加密签名
    name: 'id', // 客户端 cookie 名
    resave: false, // 禁止重置会话
    saveUninitialized: false, // 强制保存未初始化的会话
    rolling: true, // 每个请求都会强制 cookie 从而重置 cookie 的有效时间
    cookie: {
        httpOnly: true, // 仅允许服务器修改 cookies
        maxAge: 1000 * 1800, // cookie 有效时间（1000ms * 1800 = 30min）
        secure: false // 仅允许通过 https 传输（更安全）
    }
}

const FILE_UPLOAD_CONFIG: upload.Options = {
    useTempFiles: true,
    tempFileDir: UPLOAD_TMP_DIR,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB
    }
}

export {
    PORT,
    LOG_DIR,
    LOG_RFS_OPTIONS,
    DB_DIR,
    ACCOUNT_DB_INIT_SCRIPT,
    USER_DB_INIT_SCRIPT,
    ADMIN_DB_INIT_SCRIPT,
    STATIC_DIR,
    UPLOAD_TMP_DIR,
    PHOTO_ROOT_DIR,
    THUMBNAIL_DIR_NAME,
    SESSION_CONFIG,
    FILE_UPLOAD_CONFIG
}
