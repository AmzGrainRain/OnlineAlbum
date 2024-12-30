import { Fetch } from '../request'
import type { ListUserResponseT } from '../types'

export const ListUser = async (): Promise<ListUserResponseT> => {
    const resp = await Fetch<ListUserResponseT>('/auth/list', {
        method: 'POST'
    })

    return resp
}
