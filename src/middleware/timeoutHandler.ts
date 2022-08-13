import { Middleware } from '../types'
import { ABORT_CONTROLLER } from '../constants'

/**
 * Network timeout
 * References：Why the default is 2147483647 milliseconds?
 * https://github.com/denysdovhan/wtfjs/issues/61
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
const timeoutHandler: Middleware = (next) => async (req) => {
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      req[ABORT_CONTROLLER].abort()
      reject(new Error(`Network timeout at: ${req.url}`))
    }, req.timeout || 2147483647)

    void next(req)
      .then(resolve)
      .catch(reject)
      .then(() => clearTimeout(timer))
  })

  /**
   * TODO: When all browsers have realize AbortSignal.reason cancel comments
   * References：https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/reason
   */
  // const timer = setTimeout(
  //   () => req[ABORT_CONTROLLER].abort(`Network timeout at: ${req.url}`),
  //   req.timeout || 2147483647
  // )
  // try {
  //   return await next(req)
  // } finally {
  //   clearTimeout(timer)
  // }
}

export default timeoutHandler
