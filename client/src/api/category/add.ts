import { Fetch } from '../request'
import { ResponseT } from '../types'

export const AddCategory = async (name: string): Promise<boolean> => {
    const resp = await Fetch<ResponseT>('/category/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name
        })
    })

    return resp.success
}
