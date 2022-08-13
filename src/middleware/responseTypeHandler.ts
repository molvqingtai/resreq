import { Middleware } from '../types'

const responseTypeHandler: Middleware = (next) => async (req) => {
  const res = await next(req)
  return req.responseType ? await res[req.responseType]() : res
}

export default responseTypeHandler
