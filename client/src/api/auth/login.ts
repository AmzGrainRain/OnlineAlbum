import { Fetch } from '../request'
import type { LoginResponseT } from '../types'

export const Login = async (email: string, password: string): Promise<LoginResponseT> => {
    const resp = await Fetch<LoginResponseT>('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    return resp
}
