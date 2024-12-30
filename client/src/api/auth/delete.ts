import { Fetch } from '../request'
import type { DeleteUserResponseT } from '../types'

export const Delete = async (userId: number): Promise<DeleteUserResponseT> => {
    const resp = await Fetch<DeleteUserResponseT>('/auth/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userId
        })
    })

    return resp
}
