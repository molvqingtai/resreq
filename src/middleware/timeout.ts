import { Middleware } from '../index'

/**
 * Network timeout
 * References：Why the default is 2147483647 milliseconds?
 * https://github.com/denysdovhan/wtfjs/issues/61
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout
 */
const timeout: Middleware = (next) => async (req) => {
  const timer = setTimeout(() => req.abortController.abort(), req.timeout || 2147483647)
  try {
    return await next(req)
  } catch (error) {
    if (req.signal.aborted) {
      throw new Error(`network timeout at: ${req.url}`)
    } else {
      throw error
    }
  } finally {
    clearTimeout(timer)
  }
}

export default timeout
