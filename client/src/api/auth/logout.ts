import type { ResponseT } from '../types'
import { Fetch } from '../request'

export const Logout = async (): Promise<boolean> => {
    try {
        await Fetch<ResponseT>('/auth/logout', {
            method: 'GET'
        })

        return true
    }
    catch (error) {
        console.error(error)
        return false
    }
}
