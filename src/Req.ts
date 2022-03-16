import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'

export interface ReqInit extends RequestInit, ExtendInit {
  [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export default class Req extends Request {
  baseUrl?: string
  params?: Record<string, any>
  meta?: Record<string, any>
  timeout?: number
  throwHttpErrors?: boolean
  onRequestProgress?: ProgressCallback
  onResponseProgress?: ProgressCallback
  abortController: AbortController;
  readonly [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(request: Request, init?: ReqInit) {
    const abortController = new AbortController()
    const signal = init?.signal || request.signal || abortController.signal
    super(request, {
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
    this.params = init?.params
    this.meta = init?.meta
    this.timeout = init?.timeout
    this.throwHttpErrors = init?.throwHttpErrors
    this.onRequestProgress = init?.onRequestProgress
    this.onResponseProgress = init?.onResponseProgress
    this[ON_GLOBAL_REQUEST_PROGRESS] = init?.[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS]
    this.abortController = abortController
    signal.onabort = abortController.abort
  }
}
