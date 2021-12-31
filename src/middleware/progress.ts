import { Middleware, ProgressCallback, ON_GLOBAL_RESPONSE_PROGRESS } from '../index'
export const onResponse: Middleware = (next) => async (req) => {
  const res = await next(req)

  const onResponseProgress: ProgressCallback = (...args) => {
    req[ON_GLOBAL_RESPONSE_PROGRESS]?.(...args)
    req.onResponseProgress?.(...args)
  }

  new ReadableStream({
    async start(controller) {
      /**
       * When http compression is used (common for big downloads)
       * The content-length is the size after the http compression
       * While the byteLength is the size after the file has been extracted.
       */
      const total = +res.headers.get('content-length')! || 0
      const reader = res.clone().body!.getReader()
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
            ratio: carry / total,
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

  return res
}
