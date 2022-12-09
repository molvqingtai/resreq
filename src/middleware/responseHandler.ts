import { Middleware, ProgressCallback } from '../types'
import { ON_GLOBAL_DOWNLOAD_PROGRESS } from '../constants'
import Res from '../Res'

const createReadableStream = (response: Response, onDownloadProgress: ProgressCallback) =>
  new ReadableStream({
    async start(controller) {
      /**
       * When http compression is used (common for big downloads)
       * The content-length is the size after the http compression
       * While the byteLength is the size after the file has been extracted.
       */
      const total = +response.headers.get('content-length')! || 0

      /**
       * node-fetch does not support the getReader
       * so OnResponseProgress will not work
       */
      if (!response.body?.getReader) {
        return controller.close()
      }
      const reader = response.body.getReader()

      let carry = 0

      onDownloadProgress(
        {
          ratio: 0, // Current Transfer Ratio
          carry: 0, // Current Transfer Byte Size
          total: 0 // Total size of transmitted bytes
        },
        new Uint8Array() // The chunk argument is an instance of Uint8Array.
      )
      const read = async () => {
        const { done, value } = await reader.read()
        if (done) return controller.close()

        carry += value.byteLength

        onDownloadProgress(
          {
            ratio: (carry / total) * 100,
            carry,
            total
          },
          value
        )
        controller.enqueue(value)
        await read()
      }
      await read()
    }
  })

/**
 * The first middleware through which the response passes, initializing the Res
 */
const responseHandler: Middleware = (next) => async (req) => {
  // Here is the native Response
  const response: Response = await next(req)

  if (req.throwHttpError && !response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  createReadableStream(response.clone(), (...args) => {
    req.onDownloadProgress?.(...args)
    req[ON_GLOBAL_DOWNLOAD_PROGRESS]?.(...args)
  })

  /**
   * TODO: When timeout middleware can use AbortSignal.reason to throw error to cancel comments
   * Close stream when requesting cancel
   * References：https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/reason
   */
  //  const readableStream = createReadableStream(response.clone(), (...args) => {
  //   response.onDownloadProgress?.(...args)
  //   req[ON_GLOBAL_DOWNLOAD_PROGRESS]?.(...args)
  // })
  // req[ABORT_CONTROLLER].signal.addEventListener('abort', () => {
  //   debugger
  //   void readableStream.cancel()
  // })

  /**
   * Filter out request.body (not iterable) by destructuring it
   */
  return new Res(response as Res, { ...req })
}

export default responseHandler
