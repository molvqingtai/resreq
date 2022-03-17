import { Middleware } from '../index'
import Res from '../Res'
import { ON_GLOBAL_RESPONSE_PROGRESS } from '../consts'

const readStream = (response: Response, onResponseProgress: ProgressCallback) =>
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
      const reader = response.body!.getReader()

      let carry = 0

      onResponseProgress(
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

        carry += value!.byteLength

        onResponseProgress(
          {
            ratio: (carry / total) * 100,
            carry,
            total
          },
          value!
        )
        controller.enqueue(value)
        await read()
      }
      await read()
    }
  })

const responseHandler: Middleware = (next) => async (req) => {
  // Here is the native Response
  const response = await next(req)

  if (req.throwHttpError && !response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  readStream(response.clone(), (...args) => {
    response.onResponseProgress?.(...args)
    req[ON_GLOBAL_RESPONSE_PROGRESS]?.(...args)
  })

  return new Res(response, req)
}

export default responseHandler
