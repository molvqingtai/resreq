import { TypeClass, TypeMethod, TypeParam } from '@resreq/type-error-decorator'
import compose from './helper/compose'
import cleanUrl from './helper/cleanUrl'
import mergeObject from './helper/mergeObject'
// import cleanObject from './helper/cleanObject'
// import typeOf from './helper/typeOf'

interface CommonOptions extends RequestInit {
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData'
  retry?: number
  onDownloadProgress?: (progressEvent: ProgressEvent) => void
  onUploadProgress?: (progressEvent: ProgressEvent) => void
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
export type Next = (req: Req) => Promise<any>
export type Middleware = (next: Next) => (req: Req) => Promise<any>

export class Req extends Request {
  timeout
  responseType
  retry
  meta
  constructor(options: Options) {
    super(options.url, options)
    this.timeout = options.timeout ?? 5000
    this.responseType = options.responseType ?? 'json'
    this.retry = options.retry ?? 0
    this.meta = options.meta ?? {}
  }
}

@TypeClass
export default class Resreq {
  config: Config
  middleware: Middleware[] = []
  constructor(@TypeParam('Object', false) config: Config = {}) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl ?? '',
      timeout: config.timeout ?? 5000,
      responseType: config.responseType ?? 'json',
      retry: config.retry ?? 0,
      fetch: config.fetch ?? fetch.bind(globalThis)
    }
    // this.onResponseProgress = options.onResponseProgress
  }

  use(middleware: Middleware) {
    this.middleware = [...this.middleware, middleware]
    return this
  }

  async adapter(request: Request) {
    return await this.config.fetch!(request)
  }

  // response(pending) {
  //   return (onResponseProgress) =>
  //     pending.then(async (response) => {
  //       const { headers, redirected, status, statusText, type, url, ok, body } = response

  //       /**
  //        * When http compression is used (common for big downloads)
  //        * The content-length is the size after the http compression
  //        * While the byteLength is the size after the file has been extracted.
  //        */
  //       const total = +headers.get('content-length') || 0
  //       if (!ok) throw new Error(response.statusText)

  //       const data = await new Response(
  //         new ReadableStream({
  //           start(controller) {
  //             let being = 0
  //             let timing = 0
  //             const reader = body.getReader()
  //             // Initial progress
  //             onResponseProgress &&
  //               onResponseProgress(
  //                 {
  //                   ratio: 0, // Current Transfer Ratio
  //                   being: 0, // Current Transfer Byte Size
  //                   total: 0, // Total size of transmitted bytes
  //                   speed: 0 // Current transmission speed per second
  //                 },
  //                 new Uint8Array() // The chunk argument is an instance of Uint8Array.
  //               )

  //             const pipe = async () => {
  //               const startTime = +new Date()
  //               const { done, value } = await reader.read()
  //               const endTime = +new Date()

  //               if (done) return controller.close()
  //               controller.enqueue(value)

  //               being += value.byteLength
  //               timing = timing + (endTime - startTime) / 1000
  //               onResponseProgress &&
  //                 onResponseProgress(
  //                   {
  //                     ratio: being / total,
  //                     being,
  //                     total,
  //                     speed: being / timing
  //                   },
  //                   value
  //                 )
  //               return pipe()
  //             }
  //             return pipe()
  //           }
  //         })
  //       )[this.ResponseType]()

  //       return {
  //         headers,
  //         redirected,
  //         status,
  //         statusText,
  //         type,
  //         url,
  //         data
  //       }
  //     })
  // }

  @TypeMethod
  async request<T>(@TypeParam('Object') options: Options): Promise<T> {
    // const url = cleanUrl(baseUrl! + options.url)
    const url = cleanUrl(this.config.baseUrl! + options.url)
    const request = new Req({ ...mergeObject(this.config, options), url })
    const dispatch = compose(...this.middleware)
    return dispatch(this.adapter.bind(this))(request)
    // TODO Fix Content-Type
    // if (method === 'GET' && typeOf(data) === 'Object') url = transformParams(data)
    // if (method === 'POST' && typeOf(data) === 'Object') options = { ...options, body: transformBody(data) }
    // const request = new Request(url, options)
    // const dispatch = compose(this.middleware)
    // return this.response(dispatch(this.adapter.bind(this))(request))(options.onResponseProgress)
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
