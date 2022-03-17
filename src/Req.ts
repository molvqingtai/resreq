import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'

export interface ReqInit extends RequestInit {
  url?: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'
  meta?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
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
    const abortController = init?.abortController ?? new AbortController()
    const signal = init?.signal || request.signal

    super(new Request(init?.url ?? request.url, request), {
      method: init?.method ?? request.method,
      headers: init?.headers ?? request.headers,
      body: init?.body ?? request.body,
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
    // TODO: use Symbol
    this.timeout = init?.timeout ?? request.timeout
    this.throwHttpError = init?.throwHttpError ?? request.throwHttpError
    this.onRequestProgress = init?.onRequestProgress ?? request.onRequestProgress
    this.onResponseProgress = init?.onResponseProgress ?? request.onResponseProgress

    this[ON_GLOBAL_REQUEST_PROGRESS] = init?.[ON_GLOBAL_REQUEST_PROGRESS] ?? request[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS] ?? request[ON_GLOBAL_RESPONSE_PROGRESS]
    this.abortController = abortController
    signal.onabort = abortController.abort
  }
}
