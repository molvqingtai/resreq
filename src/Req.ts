import { ON_GLOBAL_REQUEST, ON_GLOBAL_RESPONSE } from './consts'

export interface ReqInit extends RequestInit {
  timeout?: number
  meta?: Record<string, any>
  onRequest?: ProgressCallback
  onResponse?: ProgressCallback
  [ON_GLOBAL_REQUEST]?: ProgressCallback
  [ON_GLOBAL_RESPONSE]?: ProgressCallback
}

export default class Req extends Request {
  meta?: { [key: string]: any }
  timeout?: number
  onRequest?: ProgressCallback
  onResponse?: ProgressCallback
  abortController: AbortController;
  readonly [ON_GLOBAL_REQUEST]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE]?: ProgressCallback
  constructor(request: Request | Req, init?: ReqInit) {
    const abortController = new AbortController()
    const signal = init?.signal ?? request.signal
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
      signal: abortController.signal,
      window: init?.window ?? (request as RequestInit).window
    })
    this.meta = init?.meta ?? (request as Req).meta
    this.timeout = init?.timeout ?? (request as Req).timeout
    this.onRequest = init?.onRequest ?? (request as Req).onRequest
    this.onResponse = init?.onResponse ?? (request as Req).onResponse
    this[ON_GLOBAL_REQUEST] = init?.[ON_GLOBAL_REQUEST] ?? (request as Req)[ON_GLOBAL_REQUEST]
    this[ON_GLOBAL_RESPONSE] = init?.[ON_GLOBAL_RESPONSE] ?? (request as Req)[ON_GLOBAL_RESPONSE]
    this.abortController = abortController
    signal.onabort = abortController.abort
  }
}
