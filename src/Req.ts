import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'
import isJsonBody from './helpers/isJsonBody'
export interface ReqInit extends Omit<RequestInit, 'body'> {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'
  meta?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
  body?: BodyInit | Record<string, any>
  abortController?: AbortController
  onRequestProgress?: ProgressCallback
  onResponseProgress?: ProgressCallback
  [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export default class Req extends Request {
  readonly meta?: Record<string, any>
  readonly timeout: number
  readonly throwHttpError: boolean
  readonly abortController: AbortController
  readonly onRequestProgress?: ProgressCallback
  readonly onResponseProgress?: ProgressCallback;
  readonly [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(request: Req, init?: ReqInit) {
    /**
     * If he init.body is JSON, reset Header and Body
     * Reference: https://github.com/axios/axios/blob/master/lib/defaults/index.js#L71
     */
    let body = init?.body as BodyInit
    const headers = new Headers(init?.headers ?? request.headers)

    if (body && isJsonBody(body)) {
      headers.set('Content-Type', 'application/json')
      try {
        body = JSON.stringify(body)
      } catch (error) {
        throw new TypeError(`Request body must be a valid JSON object.`)
      }
    } else {
      /**
       * To provide correct form boundary
       * Content-Type header should be deleted each time when new Request instantiated from another one
       * Reference: https://github.com/sindresorhus/ky/blob/de66c1613ebc4c01d16ae970c20867513347b5c6/source/core/Ky.ts#L172
       */
      headers.delete('Content-Type')
    }

    const abortController = init?.abortController ?? new AbortController()

    /**
     * Signal is empty in node-fetch and whatwg-fetch
     * so need to add abortController.signal
     * Reference: https://github.com/github/fetch/pull/1003
     */
    const signal = init?.signal || request.signal || abortController.signal

    super(new Request(init?.url ?? request.url, request), {
      method: init?.method ?? request.method,
      headers: headers,
      body: body ?? request.body,
      mode: init?.mode ?? request.mode,
      credentials: init?.credentials ?? request.credentials,
      cache: init?.cache ?? request.cache,
      redirect: init?.redirect ?? request.redirect,
      referrer: init?.referrer ?? request.referrer,
      referrerPolicy: init?.referrerPolicy ?? request.referrerPolicy,
      integrity: init?.integrity ?? request.integrity,
      keepalive: init?.keepalive ?? request.keepalive,
      signal: abortController.signal
    })

    this.meta = init?.meta ?? request.meta
    this.timeout = init?.timeout ?? request?.timeout
    this.throwHttpError = init?.throwHttpError ?? request.throwHttpError
    this.onRequestProgress = init?.onRequestProgress ?? request.onRequestProgress
    this.onResponseProgress = init?.onResponseProgress ?? request.onResponseProgress
    this[ON_GLOBAL_REQUEST_PROGRESS] = init?.[ON_GLOBAL_REQUEST_PROGRESS] ?? request[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS] ?? request[ON_GLOBAL_RESPONSE_PROGRESS]
    this.abortController = abortController
    signal.onabort = abortController.abort
  }
}
