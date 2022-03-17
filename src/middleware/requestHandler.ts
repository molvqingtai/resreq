import { Middleware, Options } from '../index'
import cleanUrl from '../helper/cleanUrl'
import Req from '../Req'

interface OverrideReqInit extends Options {
  body?: BodyInit
}

const requestHandler: Middleware = (next) => async (_req) => {
  /**
   * Before the initial request, the req is just an options object
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

  /**
   * Because in Req will determine whether the user passed in the url
   * if the url exists, then Req will be created based on the new url
   * so here you need to delete the url
   */
  Reflect.deleteProperty(req, 'url')
  return await next(new Req(request as Req, req))
}

export default requestHandler
