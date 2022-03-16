import { ON_GLOBAL_REQUEST, ON_GLOBAL_RESPONSE } from './consts'
import compose from './helper/compose'
import onRequest from './middleware/onRequest'
import onResponse from './middleware/onResponse'
import timeout from './middleware/timeout'
import Req, { ReqInit } from './Req'
import Res from './Res'

export type Next = (req: Req) => Promise<Res>
export type Middleware = (next: Next) => (req: Req) => Promise<Res>

export interface Options extends ReqInit {
  url?: string
  params?: Record<string, any>
  baseUrl?: string
  fetch?: typeof fetch
}

export default class Resreq {
  options: Options
  middleware: Middleware[] = [onRequest, timeout, onResponse]
  constructor(options: Options = {}) {
    this.options = {
      ...options,
      baseUrl: options.baseUrl ?? '',
      timeout: options.timeout ?? 10000,
      fetch: options.fetch ?? fetch.bind(globalThis)
    }
  }

  use(middleware: Middleware) {
    this.middleware = [...this.middleware, middleware]
    return this
  }

  async adapter(request: Request) {
    return await this.options.fetch!(request)
  }

  async request(options: Options): Promise<Res> {
    const dispatch = compose(...this.middleware)
    return dispatch(this.adapter.bind(this))({
      ...this.options,
      ...options,
      onRequest: options.onRequest,
      onResponse: options.onResponse,
      [ON_GLOBAL_REQUEST]: this.options.onRequest,
      [ON_GLOBAL_RESPONSE]: this.options.onResponse
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

  async path(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'path' })
  }
}

export { default as Req, ReqInit } from './Req'
export { default as Res, ResInit } from './Res'
