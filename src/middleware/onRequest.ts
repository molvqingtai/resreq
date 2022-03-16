import { Middleware, Options } from '../index'
import cleanUrl from '../helper/cleanUrl'
import Req from '../Req'

interface ReqInit extends Options {
  body?: BodyInit
}

const onRequest: Middleware = (next) => async (_req) => {
  /**
   * Before the initial request, req is not a Request instance, it is still just a normal object
   * so the type needs to be fixed
   */
  const req = _req as ReqInit

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

export default onRequest
