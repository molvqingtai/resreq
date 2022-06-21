import { ON_GLOBAL_RESPONSE_PROGRESS } from './constants'
import compose from './helpers/compose'
import requestHandler from './middleware/requestHandler'
import responseHandler from './middleware/responseHandler'
import timeout from './middleware/timeout'
import mergeHeaders from './helpers/mergeHeaders'
import Req, { ReqInit } from './Req'
import Res from './Res'

export type Next = (req: Req) => Promise<Res>
export type Middleware = (next: Next) => (req: Req) => Promise<Res>

export interface Progress {
  ratio: number // Current Transfer Ratio
  carry: number // Current Transfer Byte Size
  total: number // Total size of transmitted bytes
}

export type ProgressCallback = (progress: Progress, chunk: Uint8Array) => void

export interface Options extends ReqInit {
  baseUrl?: string
  params?: Record<string, any>
}

export default class Resreq {
  options: Options
  middleware: Middleware[] = [requestHandler, timeout, responseHandler]
  constructor(options: Options = {}) {
    this.options = {
      ...options,
      baseUrl: options.baseUrl || '',
      timeout: options.timeout || 1000,
      throwHttpError: options.throwHttpError || false
    }
  }

  use(middleware: Middleware | Middleware[]) {
    /**
     * Users can modify request.timeout through middleware, so it must be placed last
     * The response is first handled by the responseHandler，so it must be placed last
     */
    const responseHandler = this.middleware.pop()!
    const timeout = this.middleware.pop()!
    this.middleware = [...this.middleware, ...[middleware].flat(), timeout, responseHandler]
    return this
  }

  async request(options: Options): Promise<Res> {
    const dispatch = compose(...this.middleware)
    return dispatch(fetch)({
      ...this.options,
      ...options,
      headers: mergeHeaders(this.options.headers || {}, options?.headers || {}),
      onResponseProgress: options.onResponseProgress,
      // [ON_GLOBAL_REQUEST_PROGRESS]: this.options.onRequestProgress,
      [ON_GLOBAL_RESPONSE_PROGRESS]: this.options.onResponseProgress
    })
  }

  async get(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'GET' })
  }

  async post(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'POST' })
  }

  async put(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'PUT' })
  }

  async delete(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'DELETE' })
  }

  async patch(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'PATCH' })
  }

  async head(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'HEAD' })
  }
}

export { default as Req, ReqInit } from './Req'
export { default as Res, ResInit } from './Res'
