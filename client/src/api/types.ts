import type { UserT, PhotoT } from '../model'

interface ResponseT {
    success: boolean
    message: string
    ts: number
}

interface ResponseDataT<U> extends ResponseT {
    data: U
}

interface CatrgoryT {
    id: number
    name: string
    count: number
    created_at: string
}


type ListUserResponseT = ResponseDataT<UserT[]>

type RenameUserResponseT = ResponseDataT<UserT>

type DeleteUserResponseT = ResponseT

type IsLoginResponseT = ResponseDataT<UserT>

type LoginResponseT = ResponseDataT<UserT>

type RegistResponseT = ResponseDataT<UserT>

type LogoutResponseT = ResponseT

type ListCatrgoryResponseT = ResponseDataT<CatrgoryT[]>

type PhotoUploadResponseT = ResponseDataT<string[]>

type PhotoDeleteResponseT = ResponseDataT<PhotoT[]>

type PhotoListResponseT = ResponseDataT<{ photos: PhotoT[], total: number }>

type ChangeCatrgoryResponseT = ResponseT

export type {
    ResponseT,
    CatrgoryT,
    ResponseDataT,

    ListUserResponseT,
    RenameUserResponseT,
    DeleteUserResponseT,
    IsLoginResponseT,
    LoginResponseT,
    RegistResponseT,
    LogoutResponseT,
    ListCatrgoryResponseT,
    PhotoUploadResponseT,
    PhotoDeleteResponseT,
    PhotoListResponseT,
    ChangeCatrgoryResponseT
}
