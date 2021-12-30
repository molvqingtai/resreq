import { TypeClass, TypeMethod, TypeParam } from '@resreq/type-error-decorator'
import compose from './helper/compose'
import cleanUrl from './helper/cleanUrl'
import mergeObject from './helper/mergeObject'
import { download } from './middleware/progress'

export interface Progress {
  ratio: number // Current Transfer Ratio
  carry: number // Current Transfer Byte Size
  total: number // Total size of transmitted bytes
}

export type ProgressCallback = (progress: Progress, chunk: Uint8Array) => void

interface CommonOptions extends RequestInit {
  timeout?: number
  retry?: number
  onDownloadProgress?: ProgressCallback
  onUploadProgress?: ProgressCallback
}

export interface Config extends Exclude<CommonOptions, 'method'> {
  baseUrl?: string
  fetch?: typeof fetch
}

export interface Options extends CommonOptions {
  url: string
  meta?: { [key: string]: any }
}

// export interface Req extends Required<Options> {}
export type Next = (req: Req) => Promise<Response>
export type Middleware = (next: Next) => (req: Req) => Promise<any>

export class Req extends Request {
  timeout
  retry
  meta
  onDownloadProgress
  onUploadProgress
  constructor(options: Options) {
    super(options.url, options)
    this.timeout = options.timeout ?? 5000
    this.retry = options.retry ?? 0
    this.meta = options.meta ?? {}
    this.onDownloadProgress = options.onDownloadProgress
    this.onUploadProgress = options.onUploadProgress
  }
}

@TypeClass
export default class Resreq {
  config: Config
  middleware: Middleware[] = [download]
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
    const onDownloadProgress: ProgressCallback = (...args) => {
      this.config.onDownloadProgress?.(...args)
      options.onDownloadProgress?.(...args)
    }
    const onUploadProgress: ProgressCallback = (...args) => {
      this.config.onUploadProgress?.(...args)
      options.onUploadProgress?.(...args)
    }
    const request = new Req({ ...mergeObject(this.config, options), url, onDownloadProgress, onUploadProgress })
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
