import { Fetch } from '../request'
import type { IsLoginResponseT } from '../types'

export const IsAuthenticated = async (): Promise<IsLoginResponseT> => {
    const resp = await Fetch<IsLoginResponseT>('/auth/')
    return resp
}
