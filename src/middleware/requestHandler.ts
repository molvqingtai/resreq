import { Middleware, Options } from '../index'
import cleanUrl from '../helper/cleanUrl'
import Req from '../Req'

interface OverrideReqInit extends Options {
  body?: BodyInit
}

const requestHandler: Middleware = (next) => async (_req) => {
  /**
   * Before the initial request, req is not a Request instance
   * it's still just a plain object and extends body So need to override type
   */
  const req = _req as OverrideReqInit

  const url = Object.entries(req.params || {})
    .reduce((acc: URL, [key, value]) => {
      acc.searchParams.append(key, value)
      return acc
    }, new URL(cleanUrl((req.baseUrl || '') + (req.url || ''))))
    .toString()

  req.headers = new Headers(req.headers)

  if (
    // Types not supported by node, first determine if they exist
    (globalThis.FormData && req.body instanceof FormData) ||
    (globalThis.Blob && req.body instanceof Blob) ||
    req.body instanceof ArrayBuffer ||
    req.body instanceof URLSearchParams ||
    req.body instanceof ReadableStream
  ) {
    req.headers.delete('content-type')
  } else if (req.body && typeof req.body !== 'string') {
    req.headers.set('content-type', 'application/json')
    req.body = JSON.stringify(req.body)
  }

  const request = new Request(url, req)

  return await next(new Req(request, req))
}

export default requestHandler
