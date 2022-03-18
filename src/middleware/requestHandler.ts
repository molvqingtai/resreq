import { Middleware, Options } from '../index'
import cleanUrl from '../helpers/cleanUrl'
import Req from '../Req'

interface OverrideReqInit extends Options {
  body?: BodyInit
}

const requestHandler: Middleware = (next) => async (_req) => {
  /**
   * Before the initial request, the req is just an options object，So need to override type
   * JSON Body will be processed in the following new Req()
   */
  const req = _req as OverrideReqInit

  const url = Object.entries(req.params || {})
    .reduce((acc: URL, [key, value]) => {
      acc.searchParams.append(key, value)
      return acc
    }, new URL(cleanUrl((req.baseUrl || '') + (req.url || ''))))
    .toString()

  const request = new Request(url, req)

  /**
   * Because in Req will determine whether the user passed in the url
   * if the url exists, then Req will be created based on the new url
   * so here need to delete the url
   */
  Reflect.deleteProperty(req, 'url')

  return await next(new Req(request as Req, req))
}

export default requestHandler
