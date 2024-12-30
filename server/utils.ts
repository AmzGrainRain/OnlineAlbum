import path from 'path'
import fs from 'fs-extra'
import sqlite3 from 'sqlite3'
import * as sqlite from 'sqlite'
import { Response } from 'express'
import { v4 as UUIDv4 } from 'uuid'
import { DB_DIR, USER_DB_INIT_SCRIPT, ADMIN_DB_INIT_SCRIPT, PHOTO_ROOT_DIR, THUMBNAIL_DIR_NAME, ACCOUNT_DB_INIT_SCRIPT } from './config'

interface ResponseDataT<U> {
    success: boolean
    message: string
    data?: U
    ts?: number
}

const SendResponse = <U = any>(res: Response, responseData: ResponseDataT<U>): void => {
    if (!responseData.data) {
        responseData.data = null as unknown as U
    }
    responseData.ts = responseData.ts || Date.now()
    res.status(200).json(responseData)
}

const JoinPhotoPath = (userId: number, filename: string): string => {
    return path.join(PHOTO_ROOT_DIR, userId.toString(), filename)
}

const JoinThumbnailPath = (userId: number, filename: string): string => {
    return path.join(PHOTO_ROOT_DIR, userId.toString(), THUMBNAIL_DIR_NAME, filename)
}

const GenerateUniqueString = () => `${Date.now()}_${UUIDv4()}`

const GenerateUserDB = async (userId: number) => {
    const db = await sqlite.open({
        filename: path.join(DB_DIR, `${userId}.db`),
        driver: sqlite3.Database
    })

    const dbInitScript = await fs.readFile(USER_DB_INIT_SCRIPT)
    await db.exec(dbInitScript.toString())
}

const RemoveUserDB = async (userId: number) => {
    await fs.remove(path.join(DB_DIR, `${userId}.db`))
}

const RemoveUserUploads = async (userId: number) => {
    await fs.remove(path.join(PHOTO_ROOT_DIR, userId.toString()))
}

const GetUserDBInstance = async (userId: number) => {
    return await sqlite.open({
        filename: path.join(DB_DIR, `${userId}.db`),
        driver: sqlite3.Database
    })
}

const GetAccountDBInstance = async () => {
    const db = await sqlite.open({
        filename: path.join(DB_DIR, 'account.db'),
        driver: sqlite3.Database
    })

    return db
}

const InitAccountDB = async (): Promise<void> => {
    const aaccountDBPath = path.join(DB_DIR, 'account.db')
    const accountDBExists = fs.existsSync(aaccountDBPath)
    const db = await sqlite.open({
        filename: aaccountDBPath,
        driver: sqlite3.Database
    })

    if (!accountDBExists) {
        await db.exec(fs.readFileSync(ACCOUNT_DB_INIT_SCRIPT).toString())
        await GenerateUserDB(0)
    }

    await db.exec(fs.readFileSync(ADMIN_DB_INIT_SCRIPT).toString())
    await db.close()
}

export {
    InitAccountDB,
    SendResponse,
    JoinPhotoPath,
    JoinThumbnailPath,
    GenerateUniqueString,
    GenerateUserDB,
    RemoveUserDB,
    RemoveUserUploads,
    GetUserDBInstance,
    GetAccountDBInstance
}

export type { ResponseDataT }
