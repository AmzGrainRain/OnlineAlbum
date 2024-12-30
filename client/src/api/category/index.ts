import { Fetch } from '../request'
import { ListCatrgoryResponseT } from '../types'

export const ListCategory = async (): Promise<ListCatrgoryResponseT> => {
    const resp = await Fetch<ListCatrgoryResponseT>('/category/', {
        method: 'POST'
    })

    return resp
}
