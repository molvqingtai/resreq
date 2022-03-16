import { Middleware } from '../index'
import Res from '../Res'

const responseHandler: Middleware = (next) => async (req) => {
  const response = await next(req)
  if (req.throwHttpErrors && !response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }
  return new Res(response, req)
}

export default responseHandler
