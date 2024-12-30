import { Fetch } from '../request'
import { ResponseT } from '../types'

export const RenameCategory = async (catregoryId: number, name: string): Promise<boolean> => {
    const resp = await Fetch<ResponseT>('/category/rename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: catregoryId,
            name
        })
    })

    return resp.success
}
