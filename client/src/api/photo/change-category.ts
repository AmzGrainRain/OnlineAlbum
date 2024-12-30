import { Fetch } from '../request'
import { ChangeCatrgoryResponseT } from '../types'

export const ChangeCategory = async (indexes: number[], category: number): Promise<ChangeCatrgoryResponseT> => {
    const resp = await Fetch<ChangeCatrgoryResponseT>('/photo/change-category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            indexes,
            category
        })
    })

    return resp
}
