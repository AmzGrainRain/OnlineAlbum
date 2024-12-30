import { Fetch } from '../request'
import type { RenameUserResponseT } from '../types'

export const Rename = async (userId: number, name: string): Promise<RenameUserResponseT> => {
    const resp = await Fetch<RenameUserResponseT>('/auth/rename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userId,
            name
        })
    })

    return resp
}
