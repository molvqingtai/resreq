import { ON_GLOBAL_REQUEST, ON_GLOBAL_RESPONSE } from './consts'
import compose from './helper/compose'
import cleanUrl from './helper/cleanUrl'
import mergeObject from './helper/mergeObject'
import onRequest from './middleware/onRequest'
import onResponse from './middleware/onResponse'
import timeout from './middleware/timeout'
import Req, { ReqInit } from './Req'
import Res from './Res'

export type Next = (req: Req) => Promise<Res>
export type Middleware = (next: Next) => (req: Req) => Promise<Res>

export interface Config extends Omit<ReqInit, 'body' | 'method'> {
  baseUrl?: string
  fetch?: typeof fetch
}

export interface Options extends ReqInit {
  url: string
}

export default class Resreq {
  config: Config
  middleware: Middleware[] = [onRequest, timeout, onResponse]
  constructor(config: Config = {}) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl ?? '',
      timeout: config.timeout ?? 10000,
      fetch: config.fetch ?? fetch.bind(globalThis)
    }
  }

  use(middleware: Middleware) {
    this.middleware = [...this.middleware, middleware]
    return this
  }

  async adapter(request: Request) {
    return await this.config.fetch!(request)
  }

  async request<T>(options: Options): Promise<T> {
    const url = cleanUrl(this.config.baseUrl! + options.url)
    const dispatch = compose(...this.middleware)
    return dispatch(this.adapter.bind(this))({
      ...mergeObject(this.config, options),
      url,
      onRequest: options.onRequest,
      onResponse: options.onResponse,
      [ON_GLOBAL_REQUEST]: this.config.onRequest,
      [ON_GLOBAL_RESPONSE]: this.config.onResponse
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
