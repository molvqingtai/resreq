import { TypeClass, TypeMethod, TypeParam } from '@resreq/type-error-decorator'
import { ON_GLOBAL_REQUEST, ON_GLOBAL_RESPONSE } from './consts'
import compose from './helper/compose'
import cleanUrl from './helper/cleanUrl'
import mergeObject from './helper/mergeObject'
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

@TypeClass
export default class Resreq {
  config: Config
  middleware: Middleware[] = [onResponse, timeout]
  constructor(@TypeParam('Object', false) config: Config = {}) {
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

  @TypeMethod
  async request<T>(@TypeParam('Object') options: Options): Promise<T> {
    const url = cleanUrl(this.config.baseUrl! + options.url)
    const initOptions = mergeObject(this.config, options)
    const request = new Req(new Request(url, initOptions), {
      ...initOptions,
      onRequest: options.onRequest,
      onResponse: options.onResponse,
      [ON_GLOBAL_REQUEST]: this.config.onRequest,
      [ON_GLOBAL_RESPONSE]: this.config.onResponse
    })
    const dispatch = compose(...this.middleware)
    return dispatch(this.adapter.bind(this))(request)
  }

  @TypeMethod
  async get(@TypeParam('String') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ ...options, url, method: 'GET' })
  }

  @TypeMethod
  async post(@TypeParam('String') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ ...options, url, method: 'POST' })
  }

  @TypeMethod
  async put(@TypeParam('String') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ ...options, url, method: 'PUT' })
  }

  @TypeMethod
  async delete(@TypeParam('String') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ ...options, url, method: 'DELETE' })
  }

  @TypeMethod
  async path(@TypeParam('String') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ ...options, url, method: 'path' })
  }
}

export { default as Req, ReqInit } from './Req'
export { default as Res, ResInit } from './Res'
