import type { ResponseT } from './types'
import { URL_BASE } from './config'

const IsAllowedResponse = <U>(resp: any): resp is U & ResponseT => !!(resp?.success)

export const Fetch = async <U extends ResponseT>(api: string, options: RequestInit = {}): Promise<U> => {
    const resp = await fetch(URL_BASE + api, options)
    if (!resp.ok) {
        throw new Error('请求数据出错')
    }

    const json = await resp.json()
    if (!IsAllowedResponse<U>(json)) {
        throw new Error('失败的响应数据')
    }

    return json
}
