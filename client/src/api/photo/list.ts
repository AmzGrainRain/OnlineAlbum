import { Fetch } from '../request'
import { PhotoListResponseT } from '../types'

export const ListPhoto = async (page: number = 0, limit: number = 32, categoryId: number = 0): Promise<PhotoListResponseT> => {
    const resp = await Fetch<PhotoListResponseT>(`/photo/list/${categoryId}/${limit}/${page}`, {
        method: 'POST'
    })

    return resp
}
