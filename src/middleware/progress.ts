import { Middleware } from '../index'
export const download: Middleware = (next) => async (req) => {
  const { onDownloadProgress } = req
  const res = await next(req)

  if (onDownloadProgress) {
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

          carry += value!.byteLength

          onDownloadProgress(
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
  }
  return res
}
