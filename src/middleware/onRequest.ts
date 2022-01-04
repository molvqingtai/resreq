import { Middleware } from '../index'
import Req from '../Req'

const onRequest: Middleware = (next) => async (req) => {
  const request = new Request(req.url, req)
  return await next(new Req(request, req))
}

export default onRequest
