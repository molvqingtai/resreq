import { Middleware } from '../index'
import Res from '../Res'

const onResponse: Middleware = (next) => async (req) => {
  const response = await next(req)
  return new Res(response, req)
}

export default onResponse
