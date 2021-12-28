import { TypeClass, TypeMethod, TypeParam } from '@resreq/type-error-decorator'
import compose from './helper/compose'
import cleanUrl from './helper/cleanUrl'
// import cleanObject from './helper/cleanObject'
// import typeOf from './helper/typeOf'

export interface Config extends RequestInit {
  baseUrl?: string
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData'
  retry?: number
  fetch?: typeof fetch
}

export interface Options extends RequestInit {
  url: string
  timeout?: number
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'formData'
  retry?: number
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
    const {
      baseUrl,
      timeout,
      responseType,
      retry,
      body,
      cache,
      credentials,
      headers,
      integrity,
      keepalive,
      method,
      mode,
      redirect,
      referrer,
      referrerPolicy,
      signal,
      window
    } = this.config

    const url = cleanUrl(baseUrl! + options.url)
    const request = new Req({
      url,
      timeout: options.timeout ?? timeout,
      responseType: options.responseType ?? responseType,
      retry: options.retry ?? retry,
      meta: options.meta ?? {},
      body: options.body ?? body,
      cache: options.cache ?? cache,
      credentials: options.credentials ?? credentials,
      headers: new Headers({ ...headers, ...options.headers }),
      integrity: options.integrity ?? integrity,
      keepalive: options.keepalive ?? keepalive,
      method: options.method ?? method,
      mode: options.mode ?? mode,
      redirect: options.redirect ?? redirect,
      referrer: options.referrer ?? referrer,
      referrerPolicy: options.referrerPolicy ?? referrerPolicy,
      signal: options.signal ?? signal,
      window: options.window ?? window
    })
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
    return await this.request({ url, ...options, method: 'put' })
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
