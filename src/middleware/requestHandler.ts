import { type Middleware, type Options } from '../types'
import Req from '../Req'
import buildFullURL from 'src/helpers/buildFullURL'

interface OverrideReqInit extends Options {
  url: string
  body?: BodyInit
}

/**
 * The first middleware through which the request passes, initializing the Req
 */
const requestHandler: Middleware = (next) => async (_req) => {
  /**
   * Before the initial request, the req is just an options object，So need to override type
   * JSON Body will be processed in the following new Req()
   */
  const req = _req as OverrideReqInit

  const url = buildFullURL(req.baseURL, req.url, req.params)

  /**
   * Create a Req with the specified url
   */
  return (await next(new Req(req as Req, { url }))).clone()
}

export default requestHandler
