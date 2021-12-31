import { TypeClass, TypeMethod, TypeParam } from '@resreq/type-error-decorator'
import compose from './helper/compose'
import cleanUrl from './helper/cleanUrl'
import mergeObject from './helper/mergeObject'
import { onResponse } from './middleware/progress'

export interface Progress {
  ratio: number // Current Transfer Ratio
  carry: number // Current Transfer Byte Size
  total: number // Total size of transmitted bytes
}

export type ProgressCallback = (progress: Progress, chunk: Uint8Array) => void

interface CommonOptions extends RequestInit {
  timeout?: number
  retry?: number
  onRequestProgress?: ProgressCallback
  onResponseProgress?: ProgressCallback
}

export interface Config extends Exclude<CommonOptions, 'method'> {
  baseUrl?: string
  fetch?: typeof fetch
}

export const ON_GLOBAL_REQUEST_PROGRESS = Symbol('ON_GLOBAL_REQUEST_PROGRESS')
export const ON_GLOBAL_RESPONSE_PROGRESS = Symbol('ON_GLOBAL_RESPONSE_PROGRESS')

export interface Options extends CommonOptions {
  url: string
  meta?: { [key: string]: any }
  [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

// export interface Req extends Required<Options> {}
export type Next = (req: Req) => Promise<Response>
export type Middleware = (next: Next) => (req: Req) => Promise<Response>

export class Req extends Request {
  timeout
  retry
  meta
  onRequestProgress
  onResponseProgress;
  readonly [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(options: Options) {
    super(options.url, options)
    this.timeout = options.timeout ?? 5000
    this.retry = options.retry ?? 0
    this.meta = options.meta ?? {}
    this.onRequestProgress = options.onRequestProgress
    this.onResponseProgress = options.onResponseProgress
    this[ON_GLOBAL_REQUEST_PROGRESS] = options[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = options[ON_GLOBAL_RESPONSE_PROGRESS]
  }
}

@TypeClass
export default class Resreq {
  config: Config
  middleware: Middleware[] = [onResponse]
  constructor(@TypeParam('Object', false) config: Config = {}) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl ?? '',
      timeout: config.timeout ?? 5000,
      retry: config.retry ?? 0,
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
    const progress = {
      onRequestProgress: options.onRequestProgress,
      onResponseProgress: options.onResponseProgress,
      [ON_GLOBAL_REQUEST_PROGRESS]: this.config.onRequestProgress,
      [ON_GLOBAL_RESPONSE_PROGRESS]: this.config.onResponseProgress
    }
    const request = new Req({ ...mergeObject(this.config, options), url, ...progress })
    const dispatch = compose(...this.middleware)
    return dispatch(this.adapter.bind(this))(request)
  }

  @TypeMethod
  async get(@TypeParam('string') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ url, ...options, method: 'GET' })
  }

  @TypeMethod
  async post(@TypeParam('string') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ url, ...options, method: 'POST' })
  }

  @TypeMethod
  async put(@TypeParam('string') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ url, ...options, method: 'PUT' })
  }

  @TypeMethod
  async delete(@TypeParam('string') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ url, ...options, method: 'DELETE' })
  }

  @TypeMethod
  async path(@TypeParam('string') url: string, @TypeParam('Object', false) options?: Options) {
    return await this.request({ url, ...options, method: 'path' })
  }
}
