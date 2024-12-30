import { Fetch } from '../request'
import { ResponseT } from '../types'

export const DeleteCategory = async (catregoryId: number): Promise<boolean> => {
    const resp = await Fetch<ResponseT>('/category/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: catregoryId
        })
    })

    return resp.success
}
