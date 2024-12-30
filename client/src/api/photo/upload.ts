import { Fetch } from '../request'
import { PhotoUploadResponseT } from '../types'

export const UploadPhoto = async (files: FileList): Promise<PhotoUploadResponseT> => {
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
        formData.append('photos', files[i])
    }

    const resp = await Fetch<PhotoUploadResponseT>('/photo/upload', {
        method: 'POST',
        body: formData
    })

    if (!resp.success) {
        console.error(`发生错误: ${resp.message}`)
    }

    return resp
}
