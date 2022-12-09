import { Options, Middleware } from './types'
import { ON_GLOBAL_DOWNLOAD_PROGRESS } from './constants'
import compose from './helpers/compose'
import requestHandler from './middleware/requestHandler'
import responseHandler from './middleware/responseHandler'
import timeoutHandler from './middleware/timeoutHandler'
import responseTypeHandler from './middleware/responseTypeHandler'
import mergeHeaders from './helpers/mergeHeaders'
import Req from './Req'
import Res from './Res'

export default class Resreq {
  options: Options
  middleware: Middleware[] = [responseTypeHandler, requestHandler, timeoutHandler, responseHandler]
  constructor(options: Options = {}) {
    this.options = {
      ...options,
      baseURL: options.baseURL || '',
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
    const timeoutHandler = this.middleware.pop()!
    this.middleware = [...this.middleware, ...[middleware].flat(), timeoutHandler, responseHandler]
    return this
  }

  async request<T = Res>(options: Options): Promise<T> {
    const dispatch = compose(...this.middleware)
    return dispatch(fetch as any as (req: Req) => Promise<Res>)({
      ...this.options,
      ...options,
      headers: mergeHeaders(this.options.headers || {}, options?.headers || {}),
      onDownloadProgress: options.onDownloadProgress,
      [ON_GLOBAL_DOWNLOAD_PROGRESS]: this.options.onDownloadProgress
    } as unknown as Req) as unknown as T
  }

  async get<T = Res>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'GET' })
  }

  async post<T = Res>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'POST' })
  }

  async put<T = Res>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'PUT' })
  }

  async delete<T = Res>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'DELETE' })
  }

  async patch<T = Res>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'PATCH' })
  }

  async head<T = Res>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'HEAD' })
  }
}

export * from './types'
export { default as Req } from './Req'
export { default as Res } from './Res'
export { default as mergeHeaders } from './helpers/mergeHeaders'
