import { type Options, type Middleware, type Next } from './types'
import { ON_GLOBAL_DOWNLOAD_PROGRESS } from './constants'
import compose from './helpers/compose'
import requestHandler from './middleware/requestHandler'
import responseHandler from './middleware/responseHandler'
import timeoutHandler from './middleware/timeoutHandler'
import responseTypeHandler from './middleware/responseTypeHandler'
import mergeHeaders from './helpers/mergeHeaders'
import type Req from './Req'
import type Res from './Res'

export default class Resreq {
  options: Options
  middlewares: Middleware[] = [responseTypeHandler, requestHandler, timeoutHandler, responseHandler]

  constructor(options: Options = {}) {
    this.options = {
      ...options,
      baseURL: options.baseURL || '',
      timeout: options.timeout ?? 1000,
      throwHttpError: options.throwHttpError ?? false
    }

    this.use = this.use.bind(this)
    this.request = this.request.bind(this)
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.put = this.put.bind(this)
    this.delete = this.delete.bind(this)
    this.patch = this.patch.bind(this)
    this.head = this.head.bind(this)
  }

  use(middleware: Middleware | Middleware[]) {
    /**
     * Users can modify request.timeout through middleware, so it must be placed last
     * The response is first handled by the responseHandler，so it must be placed last
     */
    const responseHandler = this.middlewares.pop()!
    const timeoutHandler = this.middlewares.pop()!
    this.middlewares = [...this.middlewares, ...[middleware].flat(), responseHandler, timeoutHandler]
    return this
  }

  async request<T = Res>(options: Options): Promise<T> {
    /**
     * Every time you enter\exit the middleware,
     * clone Res/Req to ensure that the Res/Req obtained in the middle is a copy.
     */
    // const middlewares = this.middlewares.map<Middleware>((m) => (n) => async (r) => {
    //   const req = typeof r?.clone === 'function' ? r.clone() : r
    //   const res = await m(n)(req)
    //   return typeof res?.clone === 'function' ? res.clone() : res
    // })

    const dispatch = compose(...this.middlewares)
    return dispatch(fetch as unknown as Next)({
      ...this.options,
      ...options,
      meta: { ...this.options.meta, ...options.meta },
      headers: mergeHeaders(this.options.headers || {}, options?.headers || {}),
      onDownloadProgress: options.onDownloadProgress,
      [ON_GLOBAL_DOWNLOAD_PROGRESS]: this.options.onDownloadProgress
    } as unknown as Req) as unknown as T
  }

  async get<T = Res>(url: string, options?: Options) {
    return await this.request<T>({ ...options, url, method: 'GET' })
  }

  async post<T = Res>(url: string, options?: Options) {
    return await this.request<T>({ ...options, url, method: 'POST' })
  }

  async put<T = Res>(url: string, options?: Options) {
    return await this.request<T>({ ...options, url, method: 'PUT' })
  }

  async delete<T = Res>(url: string, options?: Options) {
    return await this.request<T>({ ...options, url, method: 'DELETE' })
  }

  async patch<T = Res>(url: string, options?: Options) {
    return await this.request<T>({ ...options, url, method: 'PATCH' })
  }

  async head<T = Res>(url: string, options?: Options) {
    return await this.request<T>({ ...options, url, method: 'HEAD' })
  }
}

export * from './types'
export { default as Req } from './Req'
export { default as Res } from './Res'
export { default as mergeHeaders } from './helpers/mergeHeaders'
