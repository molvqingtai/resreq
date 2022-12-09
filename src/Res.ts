import { ResInit, ResponseType, ProgressCallback } from './types'
import { ON_GLOBAL_DOWNLOAD_PROGRESS, ABORT_CONTROLLER } from './constants'
import isJsonBody from './helpers/isJsonBody'

export default class Res extends Response {
  readonly meta?: Record<string, any>
  readonly timeout: number
  readonly responseType?: ResponseType
  readonly throwHttpError: boolean
  readonly abortController: AbortController
  readonly onDownloadProgress?: ProgressCallback;
  readonly [ON_GLOBAL_DOWNLOAD_PROGRESS]?: ProgressCallback

  constructor(response: Res, init: ResInit | Response) {
    let body = (init.body ?? response.body) as BodyInit
    const headers = new Headers(init.headers ?? response.headers)
    /**
     * Automatically process the mock json entered by the user.
     */
    if (body && isJsonBody(body)) {
      try {
        body = JSON.stringify(body)
      } catch (error) {
        throw new TypeError(`Response body must be a valid JSON object.`)
      }
    }

    super(body, {
      status: init.status ?? response.status,
      statusText: init.statusText ?? response.statusText,
      headers
    })

    this.meta = (init as ResInit).meta ?? response.meta
    this.timeout = (init as ResInit).timeout ?? response.timeout
    this.responseType = (init as ResInit).responseType ?? response.responseType
    this.throwHttpError = (init as ResInit).throwHttpError ?? response.throwHttpError
    this.abortController = (init as ResInit)[ABORT_CONTROLLER] ?? response.abortController
    this.onDownloadProgress = (init as ResInit).onDownloadProgress ?? response.onDownloadProgress
    this[ON_GLOBAL_DOWNLOAD_PROGRESS] =
      (init as ResInit)[ON_GLOBAL_DOWNLOAD_PROGRESS] ?? response[ON_GLOBAL_DOWNLOAD_PROGRESS]
  }
}
