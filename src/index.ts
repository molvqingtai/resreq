import { Options, Middleware } from './types'
import { ON_GLOBAL_RESPONSE_PROGRESS } from './constants'
import compose from './helpers/compose'
import requestHandler from './middleware/requestHandler'
import responseHandler from './middleware/responseHandler'
import timeoutHandler from './middleware/timeoutHandler'
import responseTypeHandler from './middleware/responseTypeHandler'
import mergeHeaders from './helpers/mergeHeaders'

export default class Resreq {
  options: Options
  middleware: Middleware[] = [responseTypeHandler, requestHandler, timeoutHandler, responseHandler]
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
    const timeoutHandler = this.middleware.pop()!
    this.middleware = [...this.middleware, ...[middleware].flat(), timeoutHandler, responseHandler]
    return this
  }

  async request<T>(options: Options): Promise<T> {
    const dispatch = compose(...this.middleware)
    return dispatch(fetch)({
      ...this.options,
      ...options,
      headers: mergeHeaders(this.options.headers || {}, options?.headers || {}),
      onResponseProgress: options.onResponseProgress,
      [ON_GLOBAL_RESPONSE_PROGRESS]: this.options.onResponseProgress
    })
  }

  async get<T>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'GET' })
  }

  async post<T>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'POST' })
  }

  async put<T>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'PUT' })
  }

  async delete<T>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'DELETE' })
  }

  async patch<T>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'PATCH' })
  }

  async head<T>(url: string, options?: Options): Promise<T> {
    return await this.request({ ...options, url, method: 'HEAD' })
  }
}

export * from './types'
export { default as Req } from './Req'
export { default as Res } from './Res'
