import { ReqInit, ProgressCallback, ResponseType } from './types'
import { ON_GLOBAL_DOWNLOAD_PROGRESS, ABORT_CONTROLLER } from './constants'
import isJsonBody from './helpers/isJsonBody'
import { version } from '../package.json'

export default class Req extends Request {
  readonly meta?: Record<string, any>
  readonly timeout: number
  readonly responseType?: ResponseType
  readonly throwHttpError: boolean;
  readonly [ABORT_CONTROLLER]: AbortController
  readonly onDownloadProgress?: ProgressCallback;
  readonly [ON_GLOBAL_DOWNLOAD_PROGRESS]?: ProgressCallback

  constructor(request: Req, init: ReqInit | Request) {
    let body = (init.body ?? request.body) as BodyInit
    const headers = new Headers(init.headers ?? request.headers)

    /**
     * Set User-Agent (required by some servers)
     * User-Agent is specified; handle case where no UA header is desired
     * Only set header if it hasn't been set in config
     */
    !headers.has('User-Agent') && headers.set('User-Agent', `resreq/${version}`)

    /**
     * If he init.body is JSON, reset Header and Body
     * Reference: https://github.com/axios/axios/blob/master/lib/defaults/index.js#L71
     */
    if (body && isJsonBody(body)) {
      headers.set('Content-Type', 'application/json')
      try {
        body = JSON.stringify(body)
      } catch (error) {
        throw new TypeError(`Request body must be a valid JSON object.`)
      }
    }

    /**
     * If the body is a FormData or URLSearchParams
     * have it automatically request the Content-Type
     *
     * Reference:
     * https://github.com/sindresorhus/ky/blob/de66c1613ebc4c01d16ae970c20867513347b5c6/source/core/Ky.ts#L168
     * https://github.com/axios/axios/blob/e52e4dbb575fc8bd9cb7d2f5306f30ee82b40b4d/lib/defaults/index.js#L67
     * https://github.com/axios/axios/blob/e52e4dbb575fc8bd9cb7d2f5306f30ee82b40b4d/lib/adapters/xhr.js#L31
     */
    if ((globalThis.FormData && body instanceof FormData) || body instanceof URLSearchParams) {
      headers.delete('Content-Type')
    }

    const abortController = new AbortController()

    /**
     * Signal is empty in node-fetch and whatwg-fetch
     * so need to add abortController.signal
     * Reference: https://github.com/github/fetch/pull/1003
     */
    const signal = init.signal || request.signal || abortController.signal

    /**
     * If the user input a new url, a new request object is created with the new url
     */
    super(new Request(init.url ?? request.url), {
      method: init.method ?? request.method,
      headers,
      body: body ?? request.body,
      mode: init.mode ?? request.mode,
      /**
       * In node-fetch polyfill, credentials will not work
       * Reference: https://github.com/node-fetch/node-fetch/issues/49
       */
      credentials: init.credentials ?? request.credentials,
      cache: init.cache ?? request.cache,
      redirect: init.redirect ?? request.redirect,
      referrer: init.referrer ?? request.referrer,
      referrerPolicy: init.referrerPolicy ?? request.referrerPolicy,
      integrity: init.integrity ?? request.integrity,
      keepalive: init.keepalive ?? request.keepalive,
      signal: abortController.signal
    })
    this.meta = (init as ReqInit).meta ?? request.meta
    this.timeout = (init as ReqInit).timeout ?? request.timeout
    this.responseType = (init as ReqInit).responseType ?? request.responseType
    this.throwHttpError = (init as ReqInit).throwHttpError ?? request.throwHttpError
    this.onDownloadProgress = (init as ReqInit).onDownloadProgress ?? request.onDownloadProgress
    this[ON_GLOBAL_DOWNLOAD_PROGRESS] =
      (init as ReqInit)[ON_GLOBAL_DOWNLOAD_PROGRESS] ?? request[ON_GLOBAL_DOWNLOAD_PROGRESS]
    this[ABORT_CONTROLLER] = abortController
    signal.addEventListener('abort', () => abortController.abort())
  }
}
