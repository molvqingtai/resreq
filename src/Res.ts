import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'

export interface ResInit extends ResponseInit, ExtendInit {
  [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export default class Res extends Response {
  baseUrl?: string
  params?: Record<string, any>
  meta?: Record<string, any>
  timeout?: number
  throwHttpErrors?: boolean
  onRequestProgress?: ProgressCallback
  onResponseProgress?: ProgressCallback;
  readonly [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(response: Response, init?: ResInit) {
    super(response.body, {
      status: init?.status ?? response.status,
      statusText: init?.statusText ?? response.statusText,
      headers: init?.headers ?? response.headers
    })
    this.params = init?.params
    this.meta = init?.meta
    this.timeout = init?.timeout
    this.throwHttpErrors = init?.throwHttpErrors
    this.onRequestProgress = init?.onRequestProgress
    this.onResponseProgress = init?.onResponseProgress
    this[ON_GLOBAL_REQUEST_PROGRESS] = init?.[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS]
  }
}
