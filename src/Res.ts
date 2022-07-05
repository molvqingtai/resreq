import { ResInit, ProgressCallback } from './types'
import { ON_GLOBAL_RESPONSE_PROGRESS, ABORT_CONTROLLER } from './constants'

export default class Res extends Response {
  readonly meta: Record<string, any>
  readonly timeout: number
  readonly throwHttpError: boolean
  readonly abortController: AbortController
  readonly onResponseProgress?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(response: Res, init: ResInit) {
    super(response.body, {
      status: init?.status ?? response.status,
      statusText: init?.statusText ?? response.statusText,
      headers: init?.headers ?? response.headers
    })
    this.meta = init.meta ?? response.meta
    this.timeout = init.timeout ?? response.timeout
    this.throwHttpError = init.throwHttpError ?? response.throwHttpError
    this.abortController = init?.[ABORT_CONTROLLER] ?? response.abortController
    this.onResponseProgress = init?.onResponseProgress ?? response.onResponseProgress
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS] ?? response[ON_GLOBAL_RESPONSE_PROGRESS]
  }
}
