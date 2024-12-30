import { Fetch } from '../request'
import type { RegistResponseT } from '../types'

export const Regist = async (name: string,email: string, password: string): Promise<RegistResponseT> => {
    const resp = await Fetch<RegistResponseT>('/auth/regist', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    })

    return resp
}
