import { Fetch } from '../request'
import { PhotoDeleteResponseT } from '../types'

export const DeletePhoto = async (indexes: number[]): Promise<PhotoDeleteResponseT> => {
    const resp = await Fetch<PhotoDeleteResponseT>('/photo/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            indexes
        })
    })

    return resp
}
